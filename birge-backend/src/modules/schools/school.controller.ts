import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/create-school.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async create(@Body() createSchoolDto: CreateSchoolDto) {
    return this.schoolService.create(createSchoolDto);
  }

  @Get()
  async findAll() {
    return this.schoolService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolService.findOne(id);
  }

  @Get('class/:className')
  async findByClass(@Param('className') className: string) {
    return this.schoolService.findByClass(className);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async update(@Param('id') id: string, @Body() updateSchoolDto: UpdateSchoolDto) {
    return this.schoolService.update(id, updateSchoolDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  async remove(@Param('id') id: string) {
    return this.schoolService.remove(id);
  }
}