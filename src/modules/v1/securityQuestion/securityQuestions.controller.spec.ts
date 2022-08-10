import { Test, TestingModule } from '@nestjs/testing';
import SecurityQuestionsController from './securityQuestions.controller';
import SecurityQuestionsService from './securityQuestions.service';

describe('SecurityQuestion Controller', () => {
  let controller: SecurityQuestionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityQuestionsController],
      providers: [
        {
          provide: SecurityQuestionsService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SecurityQuestionsController>(SecurityQuestionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
