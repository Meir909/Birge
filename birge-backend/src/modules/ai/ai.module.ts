import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Trip } from '../../database/entities/trip.entity';
import { TripRequest } from '../../database/entities/trip-request.entity';
import { User } from '../../database/entities/user.entity';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { GeminiService } from './services/gemini.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trip, TripRequest, User]),
    ConfigModule
  ],
  controllers: [AiController],
  providers: [AiService, GeminiService],
  exports: [AiService, GeminiService],
})
export class AiModule {}