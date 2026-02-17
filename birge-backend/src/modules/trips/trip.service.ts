import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';
import { CreateTripDto, UpdateTripDto } from './dto/create-trip.dto';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(driverId: string, createTripDto: CreateTripDto): Promise<Trip> {
    const driver = await this.userRepository.findOne({
      where: { id: driverId, role: In(['driver', 'both']) },
    });

    if (!driver) {
      throw new BadRequestException('Only drivers can create trips');
    }

    if (!driver.car_plate || !driver.available_seats) {
      throw new BadRequestException('Driver profile is incomplete');
    }

    const trip = this.tripRepository.create({
      ...createTripDto,
      driver_id: driverId,
      occupied_seats: 0,
      status: 'active',
      is_recurring: true,
    });

    return this.tripRepository.save(trip);
  }

  async findAll(filters?: {
    school_id?: string;
    class?: string;
    trip_type?: string;
    status?: string;
  }): Promise<Trip[]> {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.school', 'school')
      .where('trip.status != :cancelled', { cancelled: 'cancelled' });

    if (filters?.school_id) {
      query.andWhere('trip.school_id = :schoolId', { schoolId: filters.school_id });
    }

    if (filters?.class) {
      query.andWhere('trip.class = :class', { class: filters.class });
    }

    if (filters?.trip_type) {
      query.andWhere('trip.trip_type = :tripType', { tripType: filters.trip_type });
    }

    if (filters?.status) {
      query.andWhere('trip.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: ['driver', 'school', 'participants', 'requests'],
    });

    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findOne(id);
    Object.assign(trip, updateTripDto);
    return this.tripRepository.save(trip);
  }

  async remove(id: string): Promise<void> {
    const trip = await this.findOne(id);
    trip.status = 'cancelled';
    await this.tripRepository.save(trip);
  }

  async findByDriver(driverId: string): Promise<Trip[]> {
    return this.tripRepository.find({
      where: { driver_id: driverId },
      relations: ['school'],
      order: { created_at: 'DESC' },
    });
  }

  async findAvailable(schoolId: string, classFilter?: string): Promise<Trip[]> {
    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.school', 'school')
      .where('trip.school_id = :schoolId', { schoolId })
      .andWhere('trip.status = :status', { status: 'active' })
      .andWhere('trip.occupied_seats < trip.available_seats');

    if (classFilter) {
      query.andWhere('trip.class = :class', { class: classFilter });
    }

    return query.getMany();
  }

  async updateOccupiedSeats(tripId: string, increment: number): Promise<void> {
    await this.tripRepository
      .createQueryBuilder()
      .update(Trip)
      .set({
        occupied_seats: () => `occupied_seats + ${increment}`,
        status: () => `CASE 
          WHEN occupied_seats + ${increment} >= available_seats THEN 'full'
          ELSE 'active'
        END`
      })
      .where('id = :tripId', { tripId })
      .execute();
  }
}