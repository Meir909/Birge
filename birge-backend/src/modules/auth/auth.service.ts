import { Injectable, UnauthorizedException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<any> {
    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email }
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
      role: registerDto.role || 'parent',
      is_active: true,
      is_verified: false
    });

    const savedUser = await this.userRepository.save(user);

    // Generate JWT token
    const payload = { 
      email: savedUser.email, 
      sub: savedUser.id,
      role: savedUser.role
    };

    const accessToken = this.jwtService.sign(payload);

    // Remove password from response
    const { password, ...result } = savedUser;

    return {
      user: result,
      access_token: accessToken,
      token_type: 'Bearer'
    };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'email', 'password', 'first_name', 'last_name', 'role', 'is_active', 'is_verified']
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.is_active) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userRepository.update(user.id, { 
      last_login_at: new Date() 
    });

    // Generate JWT token
    const payload = { 
      email: user.email, 
      sub: user.id,
      role: user.role
    };

    const accessToken = this.jwtService.sign(payload);

    // Get full user data
    const fullUser = await this.userRepository.findOne({
      where: { id: user.id }
    });

    // Remove password from response
    const { password, ...result } = fullUser;

    return {
      user: result,
      access_token: accessToken,
      token_type: 'Bearer'
    };
  }

  async getProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Remove password from response
    const { password, ...result } = user;
    return result as User;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // If email is being updated, check if it's unique
    if (updateProfileDto.email && updateProfileDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateProfileDto.email }
      });
      
      if (existingUser) {
        throw new BadRequestException('Email is already taken');
      }
    }

    // Update user
    await this.userRepository.update(userId, updateProfileDto);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId }
    });

    // Remove password from response
    const { password, ...result } = updatedUser;
    return result as User;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'password']
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (oldPassword === newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(userId, { password: hashedPassword });
  }

  async logout(userId: string): Promise<void> {
    // In a real implementation, you might want to invalidate the JWT token
    // For now, we'll just log the action
    this.logger.log(`User ${userId} logged out`);
  }

  async validateUser(payload: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub }
    });

    if (!user || !user.is_active) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email }
    });

    if (!user) {
      // Don't reveal if email exists or not for security
      return;
    }

    // In a real implementation, you would:
    // 1. Generate a reset token
    // 2. Save it to database with expiration
    // 3. Send email with reset link
    this.logger.log(`Password reset requested for ${email}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // In a real implementation, you would:
    // 1. Validate the reset token
    // 2. Check if token is expired
    // 3. Update the password
    // 4. Invalidate the token
    this.logger.log(`Password reset with token ${token}`);
  }
}