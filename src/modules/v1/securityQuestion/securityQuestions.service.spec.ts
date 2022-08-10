import { Test, TestingModule } from '@nestjs/testing';
import SecurityQuestionsService from './securityQuestions.service';

describe('SecurityQuestionsService', () => {
  let service: SecurityQuestionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SecurityQuestionsService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SecurityQuestionsService>(SecurityQuestionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
