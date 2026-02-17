import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../../database/entities/school.entity';
import { CreateSchoolDto, UpdateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private schoolRepository: Repository<School>,
  ) {}

  async create(createSchoolDto: CreateSchoolDto): Promise<School> {
    const school = this.schoolRepository.create(createSchoolDto);
    return this.schoolRepository.save(school);
  }

  async findAll(): Promise<School[]> {
    return this.schoolRepository.find({
      where: { is_active: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<School> {
    const school = await this.schoolRepository.findOne({
      where: { id, is_active: true },
    });
    
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    
    return school;
  }

  async update(id: string, updateSchoolDto: UpdateSchoolDto): Promise<School> {
    const school = await this.findOne(id);
    Object.assign(school, updateSchoolDto);
    return this.schoolRepository.save(school);
  }

  async remove(id: string): Promise<void> {
    const school = await this.findOne(id);
    school.is_active = false;
    await this.schoolRepository.save(school);
  }

  async findByClass(className: string): Promise<School[]> {
    return this.schoolRepository
      .createQueryBuilder('school')
      .where('school.is_active = :active', { active: true })
      .andWhere('school.available_classes && ARRAY[:className]', { className })
      .getMany();
  }
}