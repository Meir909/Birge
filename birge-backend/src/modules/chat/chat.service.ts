import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { Trip } from '../../../database/entities/trip.entity';
import { User } from '../../../database/entities/user.entity';
import { CreateMessageDto, MarkAsReadDto, GetMessagesDto } from './dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createMessage(userId: string, createMessageDto: CreateMessageDto): Promise<Message> {
    const trip = await this.tripRepository.findOne({
      where: { id: createMessageDto.trip_id }
    });

    if (!trip) {
      throw new NotFoundException('Trip not found');
    }

    // Check if user is participant of the trip
    const isParticipant = trip.driver_id === userId || 
      trip.participants?.some(p => p.user_id === userId);

    if (!isParticipant) {
      throw new Error('User is not a participant of this trip');
    }

    const message = this.messageRepository.create({
      ...createMessageDto,
      sender_id: userId,
      is_read: false
    });

    return this.messageRepository.save(message);
  }

  async getMessages(getMessagesDto: GetMessagesDto): Promise<Message[]> {
    const query = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.trip_id = :tripId', { tripId: getMessagesDto.trip_id })
      .orderBy('message.created_at', 'DESC')
      .limit(getMessagesDto.limit || 50);

    if (getMessagesDto.before) {
      query.andWhere('message.created_at < :before', { 
        before: new Date(getMessagesDto.before) 
      });
    }

    if (getMessagesDto.after) {
      query.andWhere('message.created_at > :after', { 
        after: new Date(getMessagesDto.after) 
      });
    }

    return query.getMany();
  }

  async getUnreadMessages(userId: string, tripId?: string): Promise<Message[]> {
    const query = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.sender_id != :userId', { userId })
      .andWhere('message.is_read = false');

    if (tripId) {
      query.andWhere('message.trip_id = :tripId', { tripId });
    }

    return query.getMany();
  }

  async markAsRead(userId: string, markAsReadDto: MarkAsReadDto): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { 
        id: markAsReadDto.message_id,
        sender_id: userId
      }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.is_read = true;
    await this.messageRepository.save(message);
  }

  async markAllAsRead(userId: string, tripId: string): Promise<void> {
    await this.messageRepository
      .createQueryBuilder()
      .update(Message)
      .set({ is_read: true })
      .where('trip_id = :tripId', { tripId })
      .andWhere('sender_id != :userId', { userId })
      .andWhere('is_read = false')
      .execute();
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await this.messageRepository.findOne({
      where: { id: messageId }
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.sender_id !== userId) {
      throw new Error('Not authorized to delete this message');
    }

    await this.messageRepository.remove(message);
  }

  async getChatHistory(tripId: string, days: number = 7): Promise<Message[]> {
    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - days);

    return this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .where('message.trip_id = :tripId', { tripId })
      .andWhere('message.created_at > :dateLimit', { dateLimit })
      .orderBy('message.created_at', 'ASC')
      .getMany();
  }

  async getUserLastMessages(userId: string, limit: number = 10): Promise<Message[]> {
    return this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.trip', 'trip')
      .where('message.sender_id = :userId', { userId })
      .orderBy('message.created_at', 'DESC')
      .limit(limit)
      .getMany();
  }

  async searchMessages(userId: string, query: string, tripId?: string): Promise<Message[]> {
    const dbQuery = this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.trip', 'trip')
      .where('message.content ILIKE :search', { search: `%${query}%` })
      .andWhere('(message.sender_id = :userId OR message.trip_id IN (SELECT id FROM trips WHERE driver_id = :userId))', { userId });

    if (tripId) {
      dbQuery.andWhere('message.trip_id = :tripId', { tripId });
    }

    return dbQuery
      .orderBy('message.created_at', 'DESC')
      .limit(100)
      .getMany();
  }
}