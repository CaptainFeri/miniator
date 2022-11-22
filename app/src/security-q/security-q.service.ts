import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { ForgetPasswordDto } from 'src/users/dto/forgetPassword.dto';
import { UserEntity } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import { createSecurityQuestionDto } from './dto/security-question.dto';
import { setSecurityQuestionDto } from './dto/set-security-question.dto';
import { SecurityQuestionEntity } from './entity/security.entity';
import { SecurityDocsEntity } from './entity/securityDocs.entity';

@Injectable()
export class SecurityQService {
  constructor(
    @InjectRepository(SecurityQuestionEntity)
    private readonly securityQuestionRepo: Repository<SecurityQuestionEntity>,
    @InjectRepository(SecurityDocsEntity)
    private readonly sercurityDocsRepo: Repository<SecurityDocsEntity>,
    @InjectRepository(ServiceEntity)
    private readonly serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  async getQuestions() {
    const resList = [];
    const questions = await this.sercurityDocsRepo.find();
    for (let i = 0; i < questions.length; i++) {
      const { id, title } = questions[i];
      resList.push({ id, title });
    }
    return resList;
  }

  async insertNewSecurityQuestion(data: createSecurityQuestionDto) {
    const { title, serviceId } = data;
    const ex = await this.sercurityDocsRepo.findOne({
      where: { title },
    });
    if (ex) throw new BadRequestException('TITLE.INVALID');
    const serv = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['questions'],
    });
    if (!serv) throw new BadRequestException('SERVICE.INVALID');
    const newquestion = new SecurityDocsEntity();
    newquestion.title = title;
    newquestion.service = serv;
    return await this.sercurityDocsRepo.save(newquestion);
  }

  async setSecurityQuestion(data: setSecurityQuestionDto, username: string) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new NotFoundException('USER.NOT_FOUND');
    const { answer, questionId } = data;
    const question = await this.sercurityDocsRepo.findOne({
      where: { id: questionId },
    });
    if (!question) throw new NotFoundException('QUESTION.NOT_FOUND');
    const sq = new SecurityQuestionEntity();
    sq.answer = answer;
    sq.questionId = question.id;
    sq.user = user;
    return await this.securityQuestionRepo.save(sq);
  }

  async checkAnswer(data: ForgetPasswordDto) {
    const { answer, username } = data;
    const user = await this.userRepo.findOne({
      where: { username },
      relations: ['sqs'],
    });
    if (!user) throw new NotFoundException('USER.NOT_FOUND');
    for (let i = 0; i < user.sqs.length; i++) {
      if (user.sqs[i].answer == answer) return true;
    }
    return false;
  }
}
