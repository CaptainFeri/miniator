import { Test, TestingModule } from '@nestjs/testing';
import RolesService from './roles.service';
import RolesRepository from './roles.repository';
import RoleRequestsRepository from './role-request.repository';
import { MockType } from '../types';

describe('RolesService', () => {
  let service: RolesService;
  let repository: MockType<RolesRepository>;
  let requestRepository: MockType<RoleRequestsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: RolesRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            updateById: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
        {
          provide: RoleRequestsRepository,
          useValue: {
            create: jest.fn(),
            accept: jest.fn(),
          },
        },
        RolesService,
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
    repository = module.get(RolesRepository);
    requestRepository = module.get(RoleRequestsRepository);
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

  it('should create request', async () => {
    expect(service.request).toBeDefined();
    await service.request('', '');
    expect(requestRepository.create).toBeCalled();
  });

  it('should accept request', async () => {
    expect(service.accept).toBeDefined();
    await service.accept('');
    expect(requestRepository.accept).toBeCalled();
  });
});
