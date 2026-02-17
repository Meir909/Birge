import { Controller, Get, Post, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminStatsDto, UserManagementDto, TripManagementDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboardStats(@Query() adminStatsDto: AdminStatsDto) {
    return this.adminService.getDashboardStats(adminStatsDto);
  }

  @Get('users')
  async getUserList(@Query() userManagementDto: UserManagementDto) {
    return this.adminService.getUserList(userManagementDto);
  }

  @Get('users/:userId')
  async getUserDetails(@Param('userId') userId: string) {
    return this.adminService.getUserDetails(userId);
  }

  @Post('users/:userId/status')
  async updateUserStatus(
    @Param('userId') userId: string,
    @Body('is_active') isActive: boolean
  ) {
    return this.adminService.updateUserStatus(userId, isActive);
  }

  @Delete('users/:userId')
  async deleteUser(@Param('userId') userId: string) {
    return this.adminService.deleteUser(userId);
  }

  @Get('trips')
  async getTripList(@Query() tripManagementDto: TripManagementDto) {
    return this.adminService.getTripList(tripManagementDto);
  }

  @Get('system/overview')
  async getSystemOverview() {
    return this.adminService.getSystemOverview();
  }

  @Get('activity')
  async getRecentActivity(@Query('limit') limit?: number) {
    return this.adminService.getRecentActivity(limit);
  }
}