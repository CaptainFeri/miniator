import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/common/enum/userRole.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

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

  async registerUser(data: CreateAdminDto) {
    const user = await this.userRepo.findOne({
      where: { username: data.username },
    });
    if (user) throw new BadRequestException('USER.INVALID');
    const newUser = new UserEntity();
    newUser.username = data.username;
    newUser.password = (await bcrypt.hash(data.password, 10)).toString();
    newUser.createdBy = 'self';
    await this.userRepo.save(newUser);
    return await this.generateUserToken(
      data.username,
      data.password,
      UserRole.USER,
    );
  }
}
