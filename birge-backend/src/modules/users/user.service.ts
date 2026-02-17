import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>) {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: ['school'],
    });
  }

  async findByPhone(phone: string) {
    return this.userRepository.findOne({
      where: { phone },
      relations: ['school'],
    });
  }

  async update(id: string, updateData: Partial<User>) {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.userRepository.update(userId, {
      refresh_token: refreshToken,
    });
  }

  sanitizeUser(user: User) {
    const { password, refresh_token, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}