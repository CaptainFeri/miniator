import { Test, TestingModule } from '@nestjs/testing';
import { WalletTypesService } from './wallet-types.service';
import { WalletTypesRepository } from './wallet-types.repository';
import { MockType } from '@/types';

describe('WalletsService', () => {
  let service: WalletTypesService;
  let repository: MockType<WalletTypesRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: WalletTypesRepository,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            updateById: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
        WalletTypesService,
      ],
    }).compile();

    service = module.get<WalletTypesService>(WalletTypesService);
    repository = module.get(WalletTypesRepository);
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
    await service.update({} as any);
    expect(repository.updateById).toBeCalled();
  });

  it('should getAllWithPagination', async () => {
    expect(service.getAllWithPagination).toBeDefined();
    await service.getAllWithPagination({} as any);
    expect(repository.getAllWithPagination).toBeCalled();
  });
});
