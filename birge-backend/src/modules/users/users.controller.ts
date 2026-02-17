import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserFilterDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() filterDto: UserFilterDto) {
    return this.usersService.findAll(filterDto);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getUserStats() {
    return this.usersService.getUserStats();
  }

  @Get('drivers')
  @UseGuards(JwtAuthGuard)
  async getDrivers() {
    return this.usersService.getDrivers();
  }

  @Get('parents')
  @UseGuards(JwtAuthGuard)
  async getParents() {
    return this.usersService.getParents();
  }

  @Get('students')
  @UseGuards(JwtAuthGuard)
  async getStudents() {
    return this.usersService.getStudents();
  }

  @Get('recent')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getRecentUsers(@Query('limit') limit?: number) {
    return this.usersService.getRecentUsers(limit);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchUsers(@Query('q') query: string) {
    return this.usersService.searchUsers(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}