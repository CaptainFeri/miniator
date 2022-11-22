import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateAdminDto,
  RegisterUserDto,
} from '../superadmin/dto/createAdmin.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../common/enum/userRole.enum';
import { JwtService } from '@nestjs/jwt';
import { ServiceService } from '../service/service.service';
import { SecurityQService } from '../security-q/security-q.service';
import { setSecurityQuestionDto } from 'src/security-q/dto/set-security-question.dto';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly serviceService: ServiceService,
    private readonly securityQservice: SecurityQService,
  ) {}

  async forgetPassword(data: ForgetPasswordDto) {
    return await this.securityQservice.checkAnswer(data);
  }

  async getSecurityQuestions() {
    const sq = await this.securityQservice.getQuestions();
    return sq;
  }

  async getServices() {
    const services = await this.serviceService.getUserServices();
    return services;
  }

  async setSecurityQuestion(data: setSecurityQuestionDto, username: string) {
    const security = await this.securityQservice.setSecurityQuestion(
      data,
      username,
    );
    return security;
  }

  async findUser(username: string, role: UserRole) {
    const admin = await this.userRepo.findOne({ where: { username } });
    if (admin && role == UserRole.USER) return { username, role };
    throw new NotFoundException('USER.NOT_FOUND');
  }

  async createUser(data: CreateAdminDto, subadmin) {
    const user = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (user) throw new BadRequestException('USER.INVALID');
    const newUser = new UserEntity();
    newUser.username = data.username;
    newUser.password = (await bcrypt.hash(data.password, 10)).toString();
    newUser.createdBy = subadmin['username'];
    return await this.userRepo.save(newUser);
  }

  async generateUserToken(username: string, password: string, role: UserRole) {
    if (role == UserRole.USER) {
      const user = await this.userRepo.findOne({ where: { username } });
      if (user) {
        await bcrypt.compare(password, user.password);
        const token = this.jwtService.sign({ username, role });
        return token;
      }
    }
    throw new BadRequestException('ADMIN.INVALID');
  }

  async registerUser(data: RegisterUserDto) {
    const user = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (user) throw new BadRequestException('USER.INVALID');
    const services = await this.serviceService.getAllServices();
    const newUser = new UserEntity();
    newUser.username = data.username;
    newUser.password = (await bcrypt.hash(data.password, 10)).toString();
    newUser.createdBy = 'self';
    await this.userRepo.save(newUser);
    for (let i = 0; i < services.length; i++) {
      services[i].users.push(newUser);
      await this.serviceService.saveService(services[i]);
    }
    const { questionId, answer } = data;
    if (!questionId && !answer)
      throw new BadRequestException('QUESTION.NOT_FOUND');
    const u = await this.securityQservice.setSecurityQuestion(
      { questionId, answer },
      data.username,
    );
    return await this.generateUserToken(
      data.username,
      data.password,
      UserRole.USER,
    );
  }
}
