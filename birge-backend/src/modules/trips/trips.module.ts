import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Trip, User])],
  controllers: [TripController],
  providers: [TripService],
  exports: [TripService],
})
export class TripsModule {}