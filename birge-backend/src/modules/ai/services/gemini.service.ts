import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Trip } from '../../../database/entities/trip.entity';
import { User } from '../../../database/entities/user.entity';
import { TripRequest } from '../../../database/entities/trip-request.entity';
import { 
  OptimizeRouteDto, 
  AnalyzeCompatibilityDto, 
  GenerateRecommendationsDto, 
  SafetyAnalysisDto 
} from '../dto/ai.dto';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private genAI: GoogleGenerativeAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async optimizeRoute(optimizeRouteDto: OptimizeRouteDto, trip: Trip): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Optimize this carpool route for a school trip:
        
        Trip Details:
        - Type: ${trip.trip_type}
        - Class: ${trip.class}
        - Available seats: ${trip.available_seats}
        - Current occupied seats: ${trip.occupied_seats}
        - Departure time: ${trip.departure_time}
        
        Waypoints to optimize:
        ${JSON.stringify(optimizeRouteDto.waypoints, null, 2)}
        
        Optimization type: ${optimizeRouteDto.optimization_type || 'balanced'}
        
        Please provide:
        1. Optimized route order
        2. Estimated time for each segment
        3. Total distance and duration
        4. Efficiency score (0-100)
        5. Any safety considerations
        
        Return as JSON object.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse JSON response
      const optimizedRoute = JSON.parse(this.extractJson(text));
      
      return {
        ...optimizedRoute,
        ai_efficiency_score: optimizedRoute.efficiency_score || 85,
        last_calculated: new Date()
      };
    } catch (error) {
      this.logger.error('Route optimization failed:', error);
      throw new BadRequestException('Failed to optimize route with AI');
    }
  }

  async analyzeCompatibility(analyzeCompatibilityDto: AnalyzeCompatibilityDto, trip: Trip): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze compatibility for a carpool request:
        
        Trip Details:
        - Driver: ${trip.driver.first_name} ${trip.driver.last_name}
        - Car: ${trip.driver.car_brand} ${trip.driver.car_model}
        - Available seats: ${trip.available_seats - trip.occupied_seats}
        - Route: ${trip.route.start_location.address} to ${trip.route.end_location.address}
        - Departure: ${trip.departure_time}
        - Trip type: ${trip.trip_type}
        
        Requester Details:
        - Pickup location: ${analyzeCompatibilityDto.pickup_location.address}
        - Preferences: ${analyzeCompatibilityDto.preferences?.join(', ') || 'None'}
        
        Please analyze:
        1. Compatibility score (0-100)
        2. Route impact (additional distance/time)
        3. Recommendation (accept/consider/reject)
        4. Reasons for recommendation
        5. Suggested pickup time
        
        Return as JSON object.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(this.extractJson(text));
    } catch (error) {
      this.logger.error('Compatibility analysis failed:', error);
      throw new BadRequestException('Failed to analyze compatibility with AI');
    }
  }

  async generateRecommendations(generateRecommendationsDto: GenerateRecommendationsDto): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Generate carpool recommendations for user:
        
        User Profile:
        - Role: ${generateRecommendationsDto.role || 'passenger'}
        - School ID: ${generateRecommendationsDto.school_id}
        - Preferences: ${JSON.stringify(generateRecommendationsDto.filters || {})}
        
        Please provide:
        1. List of 3-5 recommended trips
        2. Compatibility reasons for each
        3. Estimated cost savings
        4. Environmental impact
        5. Safety rating
        
        Return as JSON array.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(this.extractJson(text));
    } catch (error) {
      this.logger.error('Recommendations generation failed:', error);
      throw new BadRequestException('Failed to generate recommendations with AI');
    }
  }

  async safetyAnalysis(safetyAnalysisDto: SafetyAnalysisDto): Promise<any> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Analyze safety for this route:
        
        Route Points:
        ${JSON.stringify(safetyAnalysisDto.route_points, null, 2)}
        
        Weather Conditions:
        ${JSON.stringify(safetyAnalysisDto.weather_conditions || 'Normal conditions', null, 2)}
        
        Please analyze:
        1. Safety score (0-100)
        2. Risk factors identified
        3. Recommended precautions
        4. Alternative routes if needed
        5. Timing recommendations
        
        Return as JSON object.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return JSON.parse(this.extractJson(text));
    } catch (error) {
      this.logger.error('Safety analysis failed:', error);
      throw new BadRequestException('Failed to analyze safety with AI');
    }
  }

  async generateDriverTips(userId: string, tripId: string): Promise<string[]> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
      
      const prompt = `
        Generate 5 safety and efficiency tips for a school carpool driver.
        User ID: ${userId}
        Trip ID: ${tripId}
        
        Return as JSON array of strings.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const tips = JSON.parse(this.extractJson(text));
      return Array.isArray(tips) ? tips : [];
    } catch (error) {
      this.logger.error('Driver tips generation failed:', error);
      return [
        'Always check that all passengers are properly buckled up',
        'Follow speed limits and traffic rules',
        'Keep a safe distance from other vehicles',
        'Plan your route in advance',
        'Stay alert and avoid distractions while driving'
      ];
    }
  }

  private extractJson(text: string): string {
    // Extract JSON from markdown code blocks
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      return jsonMatch[1];
    }
    
    // Try to find JSON object in the text
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return objectMatch[0];
    }
    
    // Try to find JSON array in the text
    const arrayMatch = text.match(/\[[\s\S]*\]/);
    if (arrayMatch) {
      return arrayMatch[0];
    }
    
    return text;
  }
}