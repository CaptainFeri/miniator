import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from '../types';
import SecurityQuestionsRepository from './security-question.repository';
import SecurityQuestionsService from './security-question.service';


describe('SecurityQuestionsService', () => {
  let service: SecurityQuestionsService;
  let repository: MockType<SecurityQuestionsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SecurityQuestionsRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            updateById: jest.fn(),
            getAllWithPagination: jest.fn(),
            set: jest.fn(),
          },
        },
        SecurityQuestionsService,
      ],
    }).compile();

    service = module.get<SecurityQuestionsService>(SecurityQuestionsService);
    repository = module.get(SecurityQuestionsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create', async () => {
    expect(service.create).toBeDefined();
    await service.create({} as any);
    expect(repository.create).toBeCalled();
  });

  it('should getById', async () => {
    expect(service.getById).toBeDefined();
    await service.getById({} as any);
    expect(repository.getById).toBeCalled();
  });

  it('should update', async () => {
    expect(service.update).toBeDefined();
    await service.update('', {} as any);
    expect(repository.updateById).toBeCalled();
  });

  it('should getAllWithPagination', async () => {
    expect(service.getAllWithPagination).toBeDefined();
    await service.getAllWithPagination({} as any);
    expect(repository.getAllWithPagination).toBeCalled();
  });

  it('should set', async () => {
    expect(service.set).toBeDefined();
    await service.set('', {} as any, '');
    expect(repository.set).toBeCalled();
  });
});
