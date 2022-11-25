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
import { ProfileDto } from './dto/profile.dto';
import { SocialMediaEntity } from './social-media/entity/social-media.entity';
import { SocialMediaDto } from './dto/social-media.dto';
import { WalletEntity } from './entity/wallet.entity';
import { getCurrencies } from './type/currency.enum';
import { UserFilterDto } from 'src/superadmin/user-managment/dto/get-user.dto';
import { RoleService } from 'src/role/role.service';
import { UserLoginDto } from './dto/userLogin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserInfoEntity)
    private readonly userInfoRepo: Repository<UserInfoEntity>,
    @InjectRepository(SocialMediaEntity)
    private readonly socialMediaRepo: Repository<SocialMediaEntity>,
    @InjectRepository(WalletEntity)
    private readonly walletRepo: Repository<WalletEntity>,
    private readonly jwtService: JwtService,
    private readonly serviceService: ServiceService,
    private readonly securityQservice: SecurityQService,
    private readonly roleService: RoleService,
  ) {}

  async getUser(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('USER.NOT_FOUND');
    return user;
  }

  async getWalletsId(serviceId: number, roleId: number, userId: number) {
    const wallets = await this.walletRepo.find({
      where: { serviceId, roleId, userId },
    });
    return wallets;
  }

  async getRolesOfService(serviceId: number) {
    const roles = await this.roleService.getRolesOfService(serviceId);
    return roles;
  }

  async getUserFilter(data: UserFilterDto) {
    const { birthday = 0, city = 0, gender = null, skip, take } = data;
    const reslist = [];
    const [users, userTotal] = await this.userRepo.findAndCount({ take, skip });
    for (let i = 0; i < users.length; i++) {
      const { profileId } = users[i];
      const profile = await this.userInfoRepo.findOne({
        where: { id: profileId },
      });
      if (
        (profile && gender != null && profile.gender == gender) ||
        (profile && birthday != 0 && profile.birthday == new Date(birthday)) ||
        (profile && city != 0 && profile.city == city) ||
        (profile && gender == null && birthday == 0 && city == 0)
      ) {
        reslist.push({
          userInfo: { username: users[i].username, id: users[i].id },
          profileInfo: profile,
        });
      }
    }
    return {
      reslist,
      userTotal,
    };
  }

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
    const wallet = await this.walletRepo.find({ where: { userId: user.id } });
    delete user.password;
    return { user, info, wallet, socials: { socials, total } };
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

  async generateUserToken(data: UserLoginDto) {
    const { password, roleId, serviceId, username } = data;
    const user = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (user) {
      const walletinfo = await this.walletRepo.find({
        where: {
          serviceId,
          roleId,
          userId: user.id,
        },
      });
      await bcrypt.compare(data.password, user.password);
      const token = this.jwtService.sign({ password, role: UserRole.USER });
      return { token, walletinfo };
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
    newUser.profileId = profile.id;
    newUser.username = data.username;
    newUser.password = (await bcrypt.hash(data.password, 10)).toString();
    newUser.createdBy = 'self';
    await this.userRepo.save(newUser);

    const currencies = await getCurrencies();
    for (let i = 0; i < services.length; i++) {
      if (services[i].roles == null) services[i].roles = [];
      for (let j = 0; j < services[i].roles.length; j++) {
        for (let k = 0; k < currencies.length; k++) {
          const newWallet = new WalletEntity();
          newWallet.roleId = services[i].roles[j].id;
          newWallet.currencyId = k;
          newWallet.userId = newUser.id;
          newWallet.serviceId = services[i].id;
          await this.walletRepo.save(newWallet);
        }
      }
    }

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
    const { roleId = 0, serviceId = 0 } = data;
    if (roleId != 0 && serviceId != 0) {
      return await this.generateUserToken({
        username: data.username,
        password: data.password,
        roleId,
        serviceId,
      });
    }
    return 'done';
  }
}
