import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRole } from '../common/enum/userRole.enum';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { UserAuthGuard } from './auth/Guard/user.guard';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('test')
  @ApiBearerAuth()
  @UseGuards(UserAuthGuard)
  async test() {
    return {
      data: 'test',
    };
  }

  @Post('register')
  async registerUser(@Body() data: CreateAdminDto) {
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
