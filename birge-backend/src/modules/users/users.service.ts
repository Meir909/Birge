import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { School } from '../../../database/entities/school.entity';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Validate school exists if provided
    if (createUserDto.school_id) {
      const school = await this.schoolRepository.findOne({
        where: { id: createUserDto.school_id }
      });
      
      if (!school) {
        throw new BadRequestException('School not found');
      }
    }

    const user = this.userRepository.create({
      ...createUserDto,
      is_active: createUserDto.is_active !== undefined ? createUserDto.is_active : true,
      is_verified: createUserDto.is_verified !== undefined ? createUserDto.is_verified : false
    });

    return this.userRepository.save(user);
  }

  async findAll(filterDto: UserFilterDto): Promise<{ users: User[]; total: number }> {
    const { search, role, is_active, is_verified, school_id, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.school', 'school')
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC');

    // Apply filters
    if (search) {
      query.andWhere(
        '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (is_active !== undefined) {
      query.andWhere('user.is_active = :is_active', { is_active });
    }

    if (is_verified !== undefined) {
      query.andWhere('user.is_verified = :is_verified', { is_verified });
    }

    if (school_id) {
      query.andWhere('user.school_id = :school_id', { school_id });
    }

    const [users, total] = await query.getManyAndCount();

    return { users, total };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['school', 'trips_as_driver', 'trip_requests']
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Validate school exists if provided
    if (updateUserDto.school_id) {
      const school = await this.schoolRepository.findOne({
        where: { id: updateUserDto.school_id }
      });
      
      if (!school) {
        throw new BadRequestException('School not found');
      }
    }

    // If email is being updated, check if it's unique
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email }
      });
      
      if (existingUser) {
        throw new BadRequestException('Email is already taken');
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return this.userRepository.findOne({
      where: { id },
      relations: ['school']
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.remove(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['school']
    });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepository.find({
      where: { role },
      relations: ['school']
    });
  }

  async getDrivers(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'driver', is_active: true },
      relations: ['school']
    });
  }

  async getParents(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'parent', is_active: true },
      relations: ['school']
    });
  }

  async getStudents(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: 'student', is_active: true },
      relations: ['school']
    });
  }

  async getUserStats(): Promise<any> {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { is_active: true } });
    const verifiedUsers = await this.userRepository.count({ where: { is_verified: true } });
    
    const drivers = await this.userRepository.count({ where: { role: 'driver' } });
    const parents = await this.userRepository.count({ where: { role: 'parent' } });
    const students = await this.userRepository.count({ where: { role: 'student' } });
    const admins = await this.userRepository.count({ where: { role: 'admin' } });

    return {
      total: totalUsers,
      active: activeUsers,
      verified: verifiedUsers,
      by_role: {
        drivers,
        parents,
        students,
        admins
      },
      active_percentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0,
      verified_percentage: totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0
    };
  }

  async getRecentUsers(limit: number = 10): Promise<User[]> {
    return this.userRepository.find({
      order: { created_at: 'DESC' },
      take: limit,
      relations: ['school']
    });
  }

  async searchUsers(query: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { first_name: Like(`%${query}%`) },
        { last_name: Like(`%${query}%`) },
        { email: Like(`%${query}%`) }
      ],
      take: 20,
      relations: ['school']
    });
  }
}