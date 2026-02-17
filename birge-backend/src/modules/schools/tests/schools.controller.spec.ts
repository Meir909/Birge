import { Test, TestingModule } from '@nestjs/testing';
import { SchoolsController } from '../schools.controller';
import { SchoolsService } from '../schools.service';

describe('SchoolsController', () => {
  let controller: SchoolsController;
  let service: SchoolsService;

  const mockSchoolsService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    search: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolsController],
      providers: [
        {
          provide: SchoolsService,
          useValue: mockSchoolsService,
        },
      ],
    }).compile();

    controller = module.get<SchoolsController>(SchoolsController);
    service = module.get<SchoolsService>(SchoolsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of schools', async () => {
      const schools = [{ id: '1', name: 'Test School' }];
      mockSchoolsService.findAll.mockResolvedValue(schools);

      const result = await controller.findAll();
      expect(result).toEqual(schools);
      expect(mockSchoolsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a school by id', async () => {
      const school = { id: '1', name: 'Test School' };
      mockSchoolsService.findOne.mockResolvedValue(school);

      const result = await controller.findOne('1');
      expect(result).toEqual(school);
      expect(mockSchoolsService.findOne).toHaveBeenCalledWith('1');
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
      mockSchoolsService.create.mockResolvedValue(school);

      const result = await controller.create(createSchoolDto);
      expect(result).toEqual(school);
      expect(mockSchoolsService.create).toHaveBeenCalledWith(createSchoolDto);
    });
  });

  describe('update', () => {
    it('should update a school', async () => {
      const updateSchoolDto = { name: 'Updated School' };
      const school = { id: '1', name: 'Original School' };
      
      mockSchoolsService.update.mockResolvedValue({ ...school, ...updateSchoolDto });

      const result = await controller.update('1', updateSchoolDto);
      expect(result).toEqual({ ...school, ...updateSchoolDto });
      expect(mockSchoolsService.update).toHaveBeenCalledWith('1', updateSchoolDto);
    });
  });

  describe('remove', () => {
    it('should remove a school', async () => {
      mockSchoolsService.remove.mockResolvedValue(undefined);

      await controller.remove('1');
      expect(mockSchoolsService.remove).toHaveBeenCalledWith('1');
    });
  });

  describe('search', () => {
    it('should search schools by query', async () => {
      const schools = [{ id: '1', name: 'Test School' }];
      mockSchoolsService.search.mockResolvedValue(schools);

      const result = await controller.search('Test');
      expect(result).toEqual(schools);
      expect(mockSchoolsService.search).toHaveBeenCalledWith('Test');
    });
  });
});