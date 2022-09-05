import { Test, TestingModule } from '@nestjs/testing';
import { WalletsService } from './wallets.service';
import { WalletsRepository } from './wallets.repository';
import { MockType } from '@/types';

describe('WalletsService', () => {
  let service: WalletsService;
  let repository: MockType<WalletsRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WalletsRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            updateById: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
        WalletsService,
      ],
    }).compile();

    service = module.get<WalletsService>(WalletsService);
    repository = module.get(WalletsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should getById', async () => {
    expect(service.getById).toBeDefined();
    await service.getById({} as any);
    expect(repository.getById).toBeCalled();
  });

  it('should getAllWithPagination', async () => {
    expect(service.getAllWithPagination).toBeDefined();
    await service.getAllWithPagination({} as any);
    expect(repository.getAllWithPagination).toBeCalled();
  });
});
