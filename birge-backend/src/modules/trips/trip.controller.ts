import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto, UpdateTripDto } from './dto/create-trip.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createTripDto: CreateTripDto
  ) {
    return this.tripService.create(userId, createTripDto);
  }

  @Get()
  async findAll(
    @Query('school_id') schoolId?: string,
    @Query('class') classFilter?: string,
    @Query('trip_type') tripType?: string,
    @Query('status') status?: string
  ) {
    return this.tripService.findAll({
      school_id: schoolId,
      class: classFilter,
      trip_type: tripType,
      status: status
    });
  }

  @Get('available')
  async findAvailable(
    @Query('school_id') schoolId: string,
    @Query('class') classFilter?: string
  ) {
    return this.tripService.findAvailable(schoolId, classFilter);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findByDriver(@CurrentUser('id') userId: string) {
    return this.tripService.findByDriver(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tripService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check
    return this.tripService.update(id, updateTripDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check
    return this.tripService.remove(id);
  }
}