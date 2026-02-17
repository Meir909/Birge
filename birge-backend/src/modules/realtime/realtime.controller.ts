import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RealtimeService } from './realtime.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('realtime')
export class RealtimeController {
  constructor(private readonly realtimeService: RealtimeService) {}

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getSystemStats() {
    return this.realtimeService.getSystemStats();
  }

  @Get('trips/:tripId/status')
  @UseGuards(JwtAuthGuard)
  async getTripStatus(@Param('tripId') tripId: string) {
    return this.realtimeService.getTripStatus(tripId);
  }

  @Post('trips/:tripId/start')
  @UseGuards(JwtAuthGuard)
  async startTripTracking(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.realtimeService.startTripTracking(tripId, userId);
  }

  @Post('trips/:tripId/end')
  @UseGuards(JwtAuthGuard)
  async endTripTracking(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string
  ) {
    return this.realtimeService.endTripTracking(tripId, userId);
  }

  @Post('trips/:tripId/location')
  @UseGuards(JwtAuthGuard)
  async updateLocation(
    @Param('tripId') tripId: string,
    @Body() locationData: {
      lat: number;
      lng: number;
      speed?: number;
      heading?: number;
      accuracy?: number;
    }
  ) {
    return this.realtimeService.updateTripLocation(tripId, locationData);
  }

  @Post('users/:userId/notify')
  @UseGuards(JwtAuthGuard)
  async sendNotification(
    @Param('userId') userId: string,
    @Body() notification: {
      title: string;
      message: string;
      type: 'info' | 'warning' | 'alert';
    }
  ) {
    return this.realtimeService.sendNotificationToUser(userId, notification);
  }

  @Post('trips/:tripId/alert')
  @UseGuards(JwtAuthGuard)
  async sendTripAlert(
    @Param('tripId') tripId: string,
    @Body() alert: {
      type: 'delay' | 'route_change' | 'emergency' | 'completion';
      message: string;
      priority: 'low' | 'medium' | 'high';
    }
  ) {
    return this.realtimeService.sendTripAlert(tripId, alert);
  }

  @Post('trips/:tripId/emergency')
  @UseGuards(JwtAuthGuard)
  async handleEmergency(
    @Param('tripId') tripId: string,
    @CurrentUser('id') userId: string,
    @Body() body: { lat: number; lng: number }
  ) {
    return this.realtimeService.handleEmergency(tripId, userId, {
      lat: body.lat,
      lng: body.lng,
    });
  }
}