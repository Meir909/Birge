import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip } from '../../../database/entities/trip.entity';
import { TripRequest } from '../../../database/entities/trip-request.entity';
import { User } from '../../../database/entities/user.entity';
import { GeminiService } from './gemini.service';
import { 
  OptimizeRouteDto, 
  AnalyzeCompatibilityDto, 
  GenerateRecommendationsDto, 
  SafetyAnalysisDto 
} from '../dto/ai.dto';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripRequest)
    private requestRepository: Repository<TripRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly geminiService: GeminiService,
  ) {}

  async optimizeTripRoute(tripId: string, optimizeRouteDto: OptimizeRouteDto) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId },
      relations: ['driver', 'participants', 'participants.user']
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    const aiAnalysis = await this.geminiService.optimizeRoute(optimizeRouteDto, trip);
    
    // Update trip with AI analysis
    await this.tripRepository.update(tripId, {
      ai_metrics: aiAnalysis,
      is_ai_optimized: true,
      ai_efficiency_score: aiAnalysis.ai_efficiency_score
    });

    return aiAnalysis;
  }

  async analyzeRequestCompatibility(requestId: string) {
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: ['trip', 'trip.driver', 'requester']
    });

    if (!request) {
      throw new Error('Request not found');
    }

    const analyzeDto: AnalyzeCompatibilityDto = {
      trip_id: request.trip_id,
      requester_id: request.requester_id,
      pickup_location: request.pickup_location,
      preferences: request.requester.preferences?.notification_settings 
        ? Object.keys(request.requester.preferences.notification_settings) 
        : []
    };

    const aiAnalysis = await this.geminiService.analyzeCompatibility(analyzeDto, request.trip);
    
    // Update request with AI analysis
    await this.requestRepository.update(requestId, {
      ai_analysis: aiAnalysis
    });

    return aiAnalysis;
  }

  async generateUserRecommendations(userId: string, generateRecommendationsDto: GenerateRecommendationsDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.geminiService.generateRecommendations(generateRecommendationsDto);
  }

  async analyzeTripSafety(tripId: string, safetyAnalysisDto: SafetyAnalysisDto) {
    const trip = await this.tripRepository.findOne({
      where: { id: tripId }
    });

    if (!trip) {
      throw new Error('Trip not found');
    }

    return this.geminiService.safetyAnalysis(safetyAnalysisDto);
  }

  async getDriverTips(userId: string, tripId: string) {
    return this.geminiService.generateDriverTips(userId, tripId);
  }

  async bulkAnalyzeRequests(tripId: string) {
    const requests = await this.requestRepository.find({
      where: { trip_id: tripId, status: 'pending' },
      relations: ['trip', 'requester']
    });

    const results = [];
    for (const request of requests) {
      try {
        const analysis = await this.analyzeRequestCompatibility(request.id);
        results.push({
          requestId: request.id,
          analysis
        });
      } catch (error) {
        results.push({
          requestId: request.id,
          error: error.message
        });
      }
    }

    return results;
  }
}