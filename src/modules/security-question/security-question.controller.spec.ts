import { Test, TestingModule } from '@nestjs/testing';
import { MockType } from '@/types';
import SecurityQuestionsController from './security-question.controller';
import SecurityQuestionsService from './security-question.service';

describe('SecurityQuestion Controller', () => {
  let controller: SecurityQuestionsController;
  let service: MockType<SecurityQuestionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityQuestionsController],
      providers: [
        {
          provide: SecurityQuestionsService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            getAllWithPagination: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SecurityQuestionsController>(
      SecurityQuestionsController,
    );
    service = module.get(SecurityQuestionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', async () => {
    expect(controller.create).toBeDefined();
    await controller.create({} as any);
    expect(service.create).toBeCalled();
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

  it('should set', async () => {
    expect(controller.set).toBeDefined();
    await controller.set('', {} as any, '');
    expect(service.set).toBeCalled();
  });
});
