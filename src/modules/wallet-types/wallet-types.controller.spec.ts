import { Test, TestingModule } from '@nestjs/testing';
import WalletTypesController from './wallet-types.controller';
import WalletTypesService from './wallet-types.service';
import { MockType } from '@/types';

describe('Wallet Type Controller', () => {
  let controller: WalletTypesController;
  let service: MockType<WalletTypesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalletTypesController],
      providers: [
        {
          provide: WalletTypesService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
            getAllWithPagination: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<WalletTypesController>(WalletTypesController);
    service = module.get(WalletTypesService);
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
});
