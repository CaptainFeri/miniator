import { Test, TestingModule } from '@nestjs/testing';
import CompaniesController from './companies.controller';
import CompaniesService from './companies.service';
import { MockType } from '@/types';

describe('Companies Controller', () => {
  let controller: CompaniesController;
  let service: MockType<CompaniesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', async () => {
    expect(controller.create).toBeDefined();
    await controller.create({} as any);
    expect(service.create).toBeCalled();
  });

  it('should findOne', async () => {
    expect(controller.getById).toBeDefined();
    service.getById.mockReturnValueOnce({});
    await controller.getById({} as any);
    expect(service.getById).toBeCalled();
  });

  it('should update', async () => {
    expect(controller.update).toBeDefined();
    await controller.update('', {} as any);
    expect(service.update).toBeCalled();
  });

  it('should getAllWithPagination', async () => {
    expect(controller.getAll).toBeDefined();
    service.getAllWithPagination.mockReturnValueOnce({});
    await controller.getAll({} as any);
    expect(service.getAllWithPagination).toBeCalled();
  });
});
