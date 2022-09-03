import { Test, TestingModule } from '@nestjs/testing';
import RolesController from './roles.controller';
import RolesService from './roles.service';
import { MockType } from '../types';

describe('Roles Controller', () => {
  let controller: RolesController;
  let service: MockType<RolesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            getAllWithPagination: jest.fn(),
            accept: jest.fn(),
            request: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get(RolesService);
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

  it('should create request', async () => {
    expect(controller.request).toBeDefined();
    await controller.request('', {} as any);
    expect(service.request).toBeCalled();
  });

  it('should accept request', async () => {
    expect(controller.accept).toBeDefined();
    await controller.accept('');
    expect(service.accept).toBeCalled();
  });
});
