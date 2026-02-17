import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SchoolsService } from '../schools.service';
import { School } from '../../../database/entities/school.entity';

describe('SchoolsService', () => {
  let service: SchoolsService;
  let repository: Repository<School>;

  const mockSchoolRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolsService,
        {
          provide: getRepositoryToken(School),
          useValue: mockSchoolRepository,
        },
      ],
    }).compile();

    service = module.get<SchoolsService>(SchoolsService);
    repository = module.get<Repository<School>>(getRepositoryToken(School));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of schools', async () => {
      const schools = [{ id: '1', name: 'Test School' }];
      mockSchoolRepository.find.mockResolvedValue(schools);

      const result = await service.findAll();
      expect(result).toEqual(schools);
      expect(mockSchoolRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a school by id', async () => {
      const school = { id: '1', name: 'Test School' };
      mockSchoolRepository.findOne.mockResolvedValue(school);

      const result = await service.findOne('1');
      expect(result).toEqual(school);
      expect(mockSchoolRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['users', 'trips']
      });
    });
  });

  describe('create', () => {
    it('should create a new school', async () => {
      const createSchoolDto = { 
        name: 'New School', 
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        phone: '123-456-7890',
        email: 'school@test.com'
      };
      
      const school = { id: '1', ...createSchoolDto };
      mockSchoolRepository.create.mockReturnValue(school);
      mockSchoolRepository.save.mockResolvedValue(school);

      const result = await service.create(createSchoolDto);
      expect(result).toEqual(school);
      expect(mockSchoolRepository.create).toHaveBeenCalledWith(createSchoolDto);
      expect(mockSchoolRepository.save).toHaveBeenCalledWith(school);
    });
  });

  describe('update', () => {
    it('should update a school', async () => {
      const updateSchoolDto = { name: 'Updated School' };
      const school = { id: '1', name: 'Original School' };
      
      mockSchoolRepository.update.mockResolvedValue({ affected: 1 });
      mockSchoolRepository.findOne.mockResolvedValue({ ...school, ...updateSchoolDto });

      const result = await service.update('1', updateSchoolDto);
      expect(result).toEqual({ ...school, ...updateSchoolDto });
      expect(mockSchoolRepository.update).toHaveBeenCalledWith('1', updateSchoolDto);
    });
  });

  describe('remove', () => {
    it('should remove a school', async () => {
      mockSchoolRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(mockSchoolRepository.delete).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search schools by query', async () => {
      const schools = [{ id: '1', name: 'Test School' }];
      mockSchoolRepository.find.mockResolvedValue(schools);

      const result = await service.search('Test');
      expect(result).toEqual(schools);
      expect(mockSchoolRepository.find).toHaveBeenCalled();
    });
  });
});