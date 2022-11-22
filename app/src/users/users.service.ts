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
import { UserInfoEntity } from './info/entity/user-info.entity';
import { GenderEnum } from './info/enum/gender.enum';
import { ProfileDto } from './dto/profile.dto';
import { SocialMediaEntity } from './social-media/entity/social-media.entity';
import { SocialMediaDto } from './dto/social-media.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepo: Repository<UserInfoEntity>,
    @InjectRepository(SocialMediaEntity)
    private readonly socialMediaRepo: Repository<SocialMediaEntity>,
    private readonly jwtService: JwtService,
    private readonly serviceService: ServiceService,
    private readonly securityQservice: SecurityQService,
  ) {}

  async getSocialMedias(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException('PROFILE.NOT_FOUND');
    const info = await this.userInfoRepo.findOne({
      where: { id: user.profileId },
    });
    const [socials, total] = await this.socialMediaRepo.findAndCount({
      where: { userId: user.id },
    });
    delete user.password;
    return { socials: { socials, total } };
  }

  async addNewSocialMedia(username: string, data: SocialMediaDto) {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException('PROFILE.NOT_FOUND');
    const newSocial = new SocialMediaEntity();
    newSocial.type = data.type;
    newSocial.link = data.link;
    return await this.socialMediaRepo.save(newSocial);
  }

  async updateSocialMedia(id: number, data: SocialMediaDto) {
    const social = await this.socialMediaRepo.findOne({ where: { id } });
    if (!social) throw new BadRequestException('BAD_REQUEST');
    social.type = data.type;
    social.link = data.link;
    return await this.socialMediaRepo.save(social);
  }

  async updateProfile(username: string, data: ProfileDto) {
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) throw new BadRequestException('USER.NOT_FOUND');
    const profile = await this.userInfoRepo.findOne({
      where: { id: user.profileId },
    });
    if (!profile) throw new BadRequestException('PROFILE.NOT_FOUND');
    const {
      birthday = 0,
      city = 0,
      firstname = 0,
      gender = 0,
      lastname = 0,
      nationalCode = 0,
      phone = 0,
    } = data;
    if (birthday != 0) profile.birthday = new Date(birthday);
    if (city != 0) profile.city = city;
    if (firstname != 0) profile.firstname = firstname;
    if (lastname != 0) profile.lastname = lastname;
    if (gender != 0) profile.gender = gender;
    if (nationalCode != 0) profile.nationalCode = nationalCode;
    if (phone != 0) profile.phone = phone;
    await this.userInfoRepo.save(profile);
    return 'done';
  }

  async getProfile(username: string) {
    const user = await this.userRepo.findOne({
      where: { username },
    });
    if (!user) throw new NotFoundException('PROFILE.NOT_FOUND');
    const info = await this.userInfoRepo.findOne({
      where: { id: user.profileId },
    });
    const [socials, total] = await this.socialMediaRepo.findAndCount({
      where: { userId: user.id },
    });
    delete user.password;
    return { user, info, socials: { socials, total } };
  }

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
    let profile = await this.userInfoRepo.save(new UserInfoEntity());
    console.log(profile.id);
    newUser.profileId = profile.id;
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
