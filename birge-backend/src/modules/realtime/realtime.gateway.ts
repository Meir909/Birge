import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
  },
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(RealtimeGateway.name);
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('Realtime Gateway initialized');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token;
      if (!token) {
        this.logger.warn('Connection rejected: No token provided');
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret'),
      });

      const userId = payload.sub;
      this.connectedUsers.set(userId, client.id);
      client.data.userId = userId;

      this.logger.log(`User ${userId} connected with socket ${client.id}`);
      
      // Join user to their personal room
      client.join(`user:${userId}`);
      
      // Emit connection success
      client.emit('connected', { userId, socketId: client.id });
      
    } catch (error) {
      this.logger.error('Connection failed:', error.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.userId;
    if (userId) {
      this.connectedUsers.delete(userId);
      this.logger.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('join-trip')
  handleJoinTrip(client: Socket, payload: { tripId: string }) {
    const userId = client.data.userId;
    const { tripId } = payload;
    
    if (!tripId) {
      client.emit('error', { message: 'Trip ID is required' });
      return;
    }

    // Join trip room
    client.join(`trip:${tripId}`);
    
    // Notify others in the trip
    client.to(`trip:${tripId}`).emit('user-joined', {
      userId,
      tripId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} joined trip ${tripId}`);
    client.emit('joined-trip', { tripId });
  }

  @SubscribeMessage('leave-trip')
  handleLeaveTrip(client: Socket, payload: { tripId: string }) {
    const userId = client.data.userId;
    const { tripId } = payload;
    
    client.leave(`trip:${tripId}`);
    
    client.to(`trip:${tripId}`).emit('user-left', {
      userId,
      tripId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`User ${userId} left trip ${tripId}`);
    client.emit('left-trip', { tripId });
  }

  @SubscribeMessage('update-location')
  handleLocationUpdate(client: Socket, payload: {
    tripId: string;
    location: { lat: number; lng: number };
    speed?: number;
    heading?: number;
  }) {
    const userId = client.data.userId;
    const { tripId, location, speed, heading } = payload;
    
    if (!tripId || !location) {
      client.emit('error', { message: 'Trip ID and location are required' });
      return;
    }

    const updateData = {
      userId,
      tripId,
      location,
      speed,
      heading,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all users in the trip
    this.server.to(`trip:${tripId}`).emit('location-update', updateData);
    
    // Also emit to driver specifically if needed
    this.server.to(`driver:${tripId}`).emit('passenger-location-update', updateData);
    
    this.logger.debug(`Location update from user ${userId} in trip ${tripId}`);
  }

  @SubscribeMessage('start-trip')
  handleStartTrip(client: Socket, payload: { tripId: string }) {
    const userId = client.data.userId;
    const { tripId } = payload;
    
    // Broadcast trip start to all participants
    this.server.to(`trip:${tripId}`).emit('trip-started', {
      startedBy: userId,
      tripId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Trip ${tripId} started by user ${userId}`);
  }

  @SubscribeMessage('end-trip')
  handleEndTrip(client: Socket, payload: { tripId: string }) {
    const userId = client.data.userId;
    const { tripId } = payload;
    
    // Broadcast trip end to all participants
    this.server.to(`trip:${tripId}`).emit('trip-ended', {
      endedBy: userId,
      tripId,
      timestamp: new Date().toISOString(),
    });

    this.logger.log(`Trip ${tripId} ended by user ${userId}`);
  }

  @SubscribeMessage('send-message')
  handleChatMessage(client: Socket, payload: {
    tripId: string;
    message: string;
    type?: 'text' | 'location' | 'alert';
  }) {
    const userId = client.data.userId;
    const { tripId, message, type = 'text' } = payload;
    
    if (!tripId || !message) {
      client.emit('error', { message: 'Trip ID and message are required' });
      return;
    }

    const messageData = {
      userId,
      tripId,
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all users in the trip
    this.server.to(`trip:${tripId}`).emit('new-message', messageData);
    
    this.logger.debug(`Message from user ${userId} in trip ${tripId}: ${message}`);
  }

  @SubscribeMessage('emergency')
  handleEmergency(client: Socket, payload: {
    tripId: string;
    location: { lat: number; lng: number };
    message?: string;
  }) {
    const userId = client.data.userId;
    const { tripId, location, message } = payload;
    
    const emergencyData = {
      userId,
      tripId,
      location,
      message,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all users in the trip
    this.server.to(`trip:${tripId}`).emit('emergency-alert', emergencyData);
    
    // Also notify admins/drivers specifically
    this.server.to('admins').emit('emergency-alert', emergencyData);
    this.server.to(`driver:${tripId}`).emit('passenger-emergency', emergencyData);
    
    this.logger.warn(`EMERGENCY from user ${userId} in trip ${tripId}`);
  }

  // Server-side methods for external services
  broadcastTripUpdate(tripId: string, update: any) {
    this.server.to(`trip:${tripId}`).emit('trip-update', {
      tripId,
      ...update,
      timestamp: new Date().toISOString(),
    });
  }

  broadcastToUser(userId: string, event: string, data: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit(event, data);
    }
  }

  getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  getTripParticipants(tripId: string): string[] {
    const room = this.server.sockets.adapter.rooms.get(`trip:${tripId}`);
    return room ? Array.from(room) : [];
  }
}