import { Test, TestingModule } from '@nestjs/testing';
import WalletsController from './wallets.controller';
import WalletsService from './wallets.service';
import { MockType } from '@/types';

describe('Wallet Controller', () => {
  let controller: WalletsController;
  let service: MockType<WalletsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletsController],
      providers: [
        {
          provide: WalletsService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletsController>(WalletsController);
    service = module.get(WalletsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should getAllWithPagination', async () => {
    expect(controller.getAll).toBeDefined();
    service.getAllWithPagination.mockReturnValueOnce({});
    await controller.getAll({} as any);
    expect(service.getAllWithPagination).toBeCalled();
  });
});
