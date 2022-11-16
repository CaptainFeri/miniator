import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAdminDto } from 'src/superadmin/dto/createAdmin.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/users.entity';
import * as bcrypt from 'bcrypt';
import { AdminEntity } from 'src/admin/entity/admin.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

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
}
