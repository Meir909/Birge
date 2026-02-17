import { Controller, Post, Get, Param, Body, UseGuards, Query } from '@nestjs/common';
import { AiService } from './ai.service';
import { 
  OptimizeRouteDto, 
  AnalyzeCompatibilityDto, 
  GenerateRecommendationsDto, 
  SafetyAnalysisDto 
} from './dto/ai.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('trips/:tripId/optimize-route')
  @UseGuards(JwtAuthGuard)
  async optimizeRoute(
    @Param('tripId') tripId: string,
    @Body() optimizeRouteDto: OptimizeRouteDto,
    @CurrentUser('id') userId: string
  ) {
    return this.aiService.optimizeTripRoute(tripId, optimizeRouteDto);
  }

  @Post('requests/:requestId/analyze-compatibility')
  @UseGuards(JwtAuthGuard)
  async analyzeCompatibility(
    @Param('requestId') requestId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.aiService.analyzeRequestCompatibility(requestId);
  }

  @Post('users/:userId/recommendations')
  @UseGuards(JwtAuthGuard)
  async generateRecommendations(
    @Param('userId') userId: string,
    @Body() generateRecommendationsDto: GenerateRecommendationsDto,
    @CurrentUser('id') currentUserId: string
  ) {
    // TODO: Add authorization check
    return this.aiService.generateUserRecommendations(userId, generateRecommendationsDto);
  }

  @Post('trips/:tripId/safety-analysis')
  @UseGuards(JwtAuthGuard)
  async analyzeSafety(
    @Param('tripId') tripId: string,
    @Body() safetyAnalysisDto: SafetyAnalysisDto,
    @CurrentUser('id') userId: string
  ) {
    return this.aiService.analyzeTripSafety(tripId, safetyAnalysisDto);
  }

  @Get('users/:userId/driver-tips')
  @UseGuards(JwtAuthGuard)
  async getDriverTips(
    @Param('userId') userId: string,
    @Query('tripId') tripId: string,
    @CurrentUser('id') currentUserId: string
  ) {
    return this.aiService.getDriverTips(userId, tripId);
  }

  @Post('trips/:tripId/bulk-analyze')
  @UseGuards(JwtAuthGuard)
  async bulkAnalyzeRequests(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check (only trip driver can do this)
    return this.aiService.bulkAnalyzeRequests(tripId);
  }
}