import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { format } from 'winston';
import { join } from 'path';

// Configuration
import { databaseConfig } from './config/database.config';
import { redisConfig } from './config/redis.config';
import { jwtConfig } from './config/jwt.config';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { SchoolsModule } from './modules/schools/schools.module';
import { TripsModule } from './modules/trips/trips.module';
import { RequestsModule } from './modules/requests/requests.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { RatingsModule } from './modules/ratings/ratings.module';
import { ComplaintsModule } from './modules/complaints/complaints.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';
import { MapsModule } from './modules/maps/maps.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { FilesModule } from './modules/files/files.module';
import { AdminModule } from './modules/admin/admin.module';
import { GamificationModule } from './modules/gamification/gamification.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, jwtConfig],
      envFilePath: ['.env', '.env.local'],
    }),
    
    // Database module
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
      }),
      inject: [ConfigService],
    }),
    
    // Redis/Bull module
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          password: configService.get('redis.password'),
          db: configService.get('redis.db'),
        },
      }),
      inject: [ConfigService],
    }),
    
    // Throttler module
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ttl: configService.get('THROTTLE_TTL'),
        limit: configService.get('THROTTLE_LIMIT'),
      }),
      inject: [ConfigService],
    }),
    
    // Winston logger module
    WinstonModule.forRoot({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      defaultMeta: { service: 'birge-backend' },
      transports: [
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
        }),
        new winston.transports.Console({
          format: format.combine(
            format.colorize(),
            format.simple(),
          ),
        }),
      ],
    }),
    
    // Schedule module
    ScheduleModule.forRoot(),
    
    // Application modules
    AuthModule,
    UsersModule,
    SchoolsModule,
    TripsModule,
    RequestsModule,
    ChatModule,
    NotificationsModule,
    RatingsModule,
    ComplaintsModule,
    AnalyticsModule,
    AiModule,
    MapsModule,
    RealtimeModule,
    FilesModule,
    AdminModule,
    GamificationModule,
  ],
})
export class AppModule {}