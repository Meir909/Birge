import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TripRequest } from '../../database/entities/trip-request.entity';
import { Trip } from '../../database/entities/trip.entity';
import { User } from '../../database/entities/user.entity';
import { CreateRequestDto, UpdateRequestDto } from './dto/create-request.dto';

@Injectable()
export class RequestService {
  constructor(
    @InjectRepository(TripRequest)
    private requestRepository: Repository<TripRequest>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(requesterId: string, createRequestDto: CreateRequestDto): Promise<TripRequest> {
    const trip = await this.tripRepository.findOne({
      where: { id: createRequestDto.trip_id, status: 'active' },
    });

    if (!trip) {
      throw new BadRequestException('Trip not found or not active');
    }

    if (trip.occupied_seats >= trip.available_seats) {
      throw new BadRequestException('Trip is full');
    }

    const existingRequest = await this.requestRepository.findOne({
      where: { 
        trip_id: createRequestDto.trip_id, 
        requester_id: requesterId,
        status: 'pending'
      }
    });

    if (existingRequest) {
      throw new BadRequestException('You already have a pending request for this trip');
    }

    const request = this.requestRepository.create({
      ...createRequestDto,
      requester_id: requesterId,
      status: 'pending'
    });

    return this.requestRepository.save(request);
  }

  async findAll(filters?: {
    trip_id?: string;
    requester_id?: string;
    status?: string;
  }): Promise<TripRequest[]> {
    const query = this.requestRepository.createQueryBuilder('request')
      .leftJoinAndSelect('request.trip', 'trip')
      .leftJoinAndSelect('request.requester', 'requester')
      .orderBy('request.created_at', 'DESC');

    if (filters?.trip_id) {
      query.andWhere('request.trip_id = :tripId', { tripId: filters.trip_id });
    }

    if (filters?.requester_id) {
      query.andWhere('request.requester_id = :requesterId', { requesterId: filters.requester_id });
    }

    if (filters?.status) {
      query.andWhere('request.status = :status', { status: filters.status });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<TripRequest> {
    const request = await this.requestRepository.findOne({
      where: { id },
      relations: ['trip', 'requester']
    });

    if (!request) {
      throw new NotFoundException(`Request with ID ${id} not found`);
    }

    return request;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto): Promise<TripRequest> {
    const request = await this.findOne(id);
    
    if (updateRequestDto.status === 'accepted') {
      // Update trip occupied seats
      await this.tripRepository
        .createQueryBuilder()
        .update(Trip)
        .set({ occupied_seats: () => 'occupied_seats + 1' })
        .where('id = :tripId', { tripId: request.trip_id })
        .execute();
    }

    Object.assign(request, updateRequestDto);
    return this.requestRepository.save(request);
  }

  async remove(id: string): Promise<void> {
    const request = await this.findOne(id);
    await this.requestRepository.remove(request);
  }

  async findByTrip(tripId: string): Promise<TripRequest[]> {
    return this.requestRepository.find({
      where: { trip_id: tripId },
      relations: ['requester'],
      order: { created_at: 'DESC' }
    });
  }

  async findByRequester(requesterId: string): Promise<TripRequest[]> {
    return this.requestRepository.find({
      where: { requester_id: requesterId },
      relations: ['trip', 'trip.driver'],
      order: { created_at: 'DESC' }
    });
  }

  async acceptRequest(id: string): Promise<TripRequest> {
    return this.update(id, { status: 'accepted' });
  }

  async rejectRequest(id: string, reason?: string): Promise<TripRequest> {
    return this.update(id, { 
      status: 'rejected',
      rejection_reason: reason
    });
  }
}