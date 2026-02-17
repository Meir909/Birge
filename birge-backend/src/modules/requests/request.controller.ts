import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto, UpdateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('requests')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser('id') userId: string,
    @Body() createRequestDto: CreateRequestDto
  ) {
    return this.requestService.create(userId, createRequestDto);
  }

  @Get()
  async findAll(
    @Query('trip_id') tripId?: string,
    @Query('requester_id') requesterId?: string,
    @Query('status') status?: string
  ) {
    return this.requestService.findAll({
      trip_id: tripId,
      requester_id: requesterId,
      status: status
    });
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async findByRequester(@CurrentUser('id') userId: string) {
    return this.requestService.findByRequester(userId);
  }

  @Get('trip/:tripId')
  async findByTrip(@Param('tripId') tripId: string) {
    return this.requestService.findByTrip(tripId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Put(':id/accept')
  @UseGuards(JwtAuthGuard)
  async acceptRequest(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check (only trip driver can accept)
    return this.requestService.acceptRequest(id);
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard)
  async rejectRequest(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check (only trip driver can reject)
    return this.requestService.rejectRequest(id, reason);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string
  ) {
    // TODO: Add authorization check
    return this.requestService.remove(id);
  }
}