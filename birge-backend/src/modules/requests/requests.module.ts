import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TripRequest } from '../../database/entities/trip-request.entity';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TripRequest, Trip, User])],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestsModule {}