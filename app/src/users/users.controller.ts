import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../common/enum/userRole.enum';
import {
  CreateAdminDto,
  RegisterUserDto,
} from 'src/superadmin/dto/createAdmin.dto';
import { UserAuthGuard } from './auth/Guard/user.guard';
import { UsersService } from './users.service';
import { ForgetPasswordDto } from './dto/forgetPassword.dto';
import { UserExpressRequest } from './auth/types/userExpressRequest';
import { ProfileDto } from './dto/profile.dto';
import { SocialMediaDto } from './dto/social-media.dto';
import { UserLoginDto } from './dto/userLogin.dto';

@Controller('user')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('social-media')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getSocials(@Req() req: UserExpressRequest) {
    const socials = await this.userService.getSocialMedias(req.user.username);
    return {
      data: socials,
    };
  }

  @Post('social-media')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  async createSocialMedia(
    @Body() data: SocialMediaDto,
    @Req() req: UserExpressRequest,
  ) {
    const social = await this.userService.addNewSocialMedia(
      req.user.username,
      data,
    );
    return {
      data: social,
    };
  }

  @Post('social-media/:id')
  @UseGuards(UserAuthGuard)
  @ApiBearerAuth()
  async updateSocialMedia(
    @Param('id') id: number,
    @Body() data: SocialMediaDto,
  ) {
    const social = await this.userService.updateSocialMedia(id, data);
    return {
      data: social,
    };
  }

  @Post('info')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async updateProfile(
    @Req() req: UserExpressRequest,
    @Body() data: ProfileDto,
  ) {
    return {
      data: await this.userService.updateProfile(req.user.username, data),
    };
  }

  @Get('info')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async getProfile(@Req() req: UserExpressRequest) {
    return {
      data: await this.userService.getProfile(req.user.username),
    };
  }

  @Post('check-security-answer')
  async forgetPassword(@Body() data: ForgetPasswordDto) {
    const check = await this.userService.forgetPassword(data);
    if (check == true) {
      return {
        data: 'SUCCESS',
      };
    } else {
      throw new BadRequestException('USER.INVALID');
    }
  }

  @Get('security-questions')
  async getSecurityQuestion() {
    const sq = await this.userService.getSecurityQuestions();
    return {
      data: sq,
    };
  }

  @Get('services')
  async seeSerivces() {
    const services = await this.userService.getServices();
    return {
      data: services,
    };
  }

  @Get('role-service/:id')
  async getRolesOfService(@Param('id') serviceId: number) {
    const roles = await this.userService.getRolesOfService(serviceId);
    return {
      data: roles,
    };
  }

  @Get('test')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async test() {
    return {
      data: 'test',
    };
  }

  @Post('register')
  async registerUser(@Body() data: RegisterUserDto) {
    const user = await this.userService.registerUser(data);
    return {
      data: user,
    };
  }

  @Post('login')
  async loginUser(@Body() data: UserLoginDto) {
    const userToken = await this.userService.generateUserToken(data);
    return {
      data: userToken,
    };
  }
}
