import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  BadRequestException,
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

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
  async loginUser(@Body() data: CreateAdminDto) {
    const userToken = await this.userService.generateUserToken(
      data.username,
      data.password,
      UserRole.USER,
    );
    return {
      data: userToken,
    };
  }
}
