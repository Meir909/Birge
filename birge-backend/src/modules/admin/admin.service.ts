import { Injectable, Logger, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { Trip } from '../../../database/entities/trip.entity';
import { TripRequest } from '../../../database/entities/trip-request.entity';
import { School } from '../../../database/entities/school.entity';
import { AdminStatsDto, UserManagementDto, TripManagementDto } from '../dto/admin.dto';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Trip)
    private tripRepository: Repository<Trip>,
    @InjectRepository(TripRequest)
    private requestRepository: Repository<TripRequest>,
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async getDashboardStats(adminStatsDto: AdminStatsDto): Promise<any> {
    const startDate = adminStatsDto.start_date ? new Date(adminStatsDto.start_date) : new Date();
    const endDate = adminStatsDto.end_date ? new Date(adminStatsDto.end_date) : new Date();
    
    if (!adminStatsDto.start_date) {
      startDate.setDate(startDate.getDate() - 30); // Last 30 days by default
    }

    // User statistics
    const totalUsers = await this.userRepository.count();
    const newUsers = await this.userRepository.count({
      where: {
        created_at: Between(startDate, endDate)
      }
    });

    // Trip statistics
    const totalTrips = await this.tripRepository.count();
    const activeTrips = await this.tripRepository.count({
      where: { status: 'active' }
    });
    const newTrips = await this.tripRepository.count({
      where: {
        created_at: Between(startDate, endDate)
      }
    });

    // Request statistics
    const totalRequests = await this.requestRepository.count();
    const pendingRequests = await this.requestRepository.count({
      where: { status: 'pending' }
    });

    // School statistics
    const totalSchools = await this.schoolRepository.count();

    // Revenue simulation (in real app, this would come from payment records)
    const estimatedRevenue = activeTrips * 50; // $50 per active trip

    return {
      users: {
        total: totalUsers,
        new: newUsers,
        active_percentage: totalUsers > 0 ? Math.round((activeTrips / totalUsers) * 100) : 0
      },
      trips: {
        total: totalTrips,
        active: activeTrips,
        new: newTrips,
        completion_rate: totalTrips > 0 ? Math.round((totalTrips / totalTrips) * 100) : 0
      },
      requests: {
        total: totalRequests,
        pending: pendingRequests,
        acceptance_rate: totalRequests > 0 ? Math.round(((totalRequests - pendingRequests) / totalRequests) * 100) : 0
      },
      schools: {
        total: totalSchools
      },
      revenue: {
        estimated: estimatedRevenue,
        currency: 'USD'
      },
      period: {
        start: startDate,
        end: endDate
      }
    };
  }

  async getUserList(userManagementDto: UserManagementDto): Promise<any> {
    const page = userManagementDto.page || 1;
    const limit = userManagementDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.userRepository.createQueryBuilder('user')
      .select([
        'user.id',
        'user.email',
        'user.first_name',
        'user.last_name',
        'user.phone',
        'user.role',
        'user.is_active',
        'user.is_verified',
        'user.created_at',
        'user.last_login_at'
      ])
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', 'DESC');

    if (userManagementDto.is_active !== undefined) {
      query.andWhere('user.is_active = :isActive', { isActive: userManagementDto.is_active });
    }

    if (userManagementDto.is_verified !== undefined) {
      query.andWhere('user.is_verified = :isVerified', { isVerified: userManagementDto.is_verified });
    }

    if (userManagementDto.role) {
      query.andWhere('user.role = :role', { role: userManagementDto.role });
    }

    const [users, total] = await query.getManyAndCount();

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTripList(tripManagementDto: TripManagementDto): Promise<any> {
    const page = tripManagementDto.page || 1;
    const limit = tripManagementDto.limit || 10;
    const skip = (page - 1) * limit;

    const query = this.tripRepository.createQueryBuilder('trip')
      .leftJoinAndSelect('trip.driver', 'driver')
      .leftJoinAndSelect('trip.school', 'school')
      .select([
        'trip.id',
        'trip.name',
        'trip.status',
        'trip.start_time',
        'trip.end_time',
        'trip.capacity',
        'trip.current_participants',
        'driver.id',
        'driver.first_name',
        'driver.last_name',
        'school.id',
        'school.name'
      ])
      .skip(skip)
      .take(limit)
      .orderBy('trip.created_at', 'DESC');

    if (tripManagementDto.status) {
      query.andWhere('trip.status = :status', { status: tripManagementDto.status });
    }

    if (tripManagementDto.driver_id) {
      query.andWhere('trip.driver_id = :driverId', { driverId: tripManagementDto.driver_id });
    }

    if (tripManagementDto.school_id) {
      query.andWhere('trip.school_id = :schoolId', { schoolId: tripManagementDto.school_id });
    }

    const [trips, total] = await query.getManyAndCount();

    return {
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserDetails(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['school']
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    await this.userRepository.update(userId, { is_active: isActive });
    this.logger.log(`User ${userId} status updated to ${isActive}`);
  }

  async getSystemOverview(): Promise<any> {
    const serverStats = {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage()
    };

    const dbStats = {
      users: await this.userRepository.count(),
      trips: await this.tripRepository.count(),
      requests: await this.requestRepository.count(),
      schools: await this.schoolRepository.count()
    };

    return {
      server: serverStats,
      database: dbStats,
      timestamp: new Date()
    };
  }

  async getRecentActivity(limit: number = 10): Promise<any[]> {
    // This would typically aggregate recent activities from all modules
    const recentUsers = await this.userRepository.find({
      order: { created_at: 'DESC' },
      take: limit
    });

    const recentTrips = await this.tripRepository.find({
      order: { created_at: 'DESC' },
      take: limit
    });

    return [
      ...recentUsers.map(user => ({
        type: 'user_registered',
        user_id: user.id,
        timestamp: user.created_at,
        data: { name: `${user.first_name} ${user.last_name}` }
      })),
      ...recentTrips.map(trip => ({
        type: 'trip_created',
        trip_id: trip.id,
        timestamp: trip.created_at,
        data: { name: trip.name }
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new Error('User not found');
    }

    // In a real implementation, you'd want to handle related data properly
    await this.userRepository.remove(user);
    this.logger.log(`User ${userId} deleted`);
  }
}