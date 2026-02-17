import { Injectable, Logger } from '@nestjs/common';
import { RealtimeGateway } from './realtime.gateway';

@Injectable()
export class RealtimeService {
  private readonly logger = new Logger(RealtimeService.name);

  constructor(private readonly realtimeGateway: RealtimeGateway) {}

  async startTripTracking(tripId: string, driverId: string) {
    this.logger.log(`Starting trip tracking for trip ${tripId}`);
    
    // Broadcast trip start
    this.realtimeGateway.broadcastTripUpdate(tripId, {
      status: 'in_progress',
      startedAt: new Date().toISOString(),
      driverId,
    });
  }

  async updateTripLocation(tripId: string, locationData: {
    lat: number;
    lng: number;
    speed?: number;
    heading?: number;
    accuracy?: number;
  }) {
    // This would be called by external services or GPS tracking
    this.realtimeGateway.broadcastTripUpdate(tripId, {
      location: locationData,
      updatedAt: new Date().toISOString(),
    });
  }

  async endTripTracking(tripId: string, driverId: string) {
    this.logger.log(`Ending trip tracking for trip ${tripId}`);
    
    // Broadcast trip end
    this.realtimeGateway.broadcastTripUpdate(tripId, {
      status: 'completed',
      endedAt: new Date().toISOString(),
      driverId,
    });
  }

  async sendNotificationToUser(userId: string, notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'alert';
  }) {
    this.realtimeGateway.broadcastToUser(userId, 'notification', {
      ...notification,
      timestamp: new Date().toISOString(),
    });
  }

  async sendTripAlert(tripId: string, alert: {
    type: 'delay' | 'route_change' | 'emergency' | 'completion';
    message: string;
    priority: 'low' | 'medium' | 'high';
  }) {
    this.realtimeGateway.broadcastTripUpdate(tripId, {
      alert,
      timestamp: new Date().toISOString(),
    });
  }

  async getTripStatus(tripId: string): Promise<{
    participants: number;
    connected: boolean;
    lastUpdate: string;
  }> {
    const participants = this.realtimeGateway.getTripParticipants(tripId);
    
    return {
      participants: participants.length,
      connected: participants.length > 0,
      lastUpdate: new Date().toISOString(),
    };
  }

  async getSystemStats(): Promise<{
    connectedUsers: number;
    activeTrips: number;
    serverUptime: number;
  }> {
    const connectedUsers = this.realtimeGateway.getConnectedUsersCount();
    
    return {
      connectedUsers,
      activeTrips: 0, // Would need to track active trips
      serverUptime: process.uptime(),
    };
  }

  async handleEmergency(tripId: string, userId: string, location: { lat: number; lng: number }) {
    this.logger.warn(`Emergency reported for trip ${tripId} by user ${userId}`);
    
    // Send emergency alert to all trip participants
    this.realtimeGateway.broadcastTripUpdate(tripId, {
      emergency: {
        userId,
        location,
        timestamp: new Date().toISOString(),
      },
    });
  }
}