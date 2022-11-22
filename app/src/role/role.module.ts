import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entity/admin.entity';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { UserEntity } from 'src/users/entity/users.entity';
import { RoleEntity } from './entity/role.entity';
import { RoleService } from './role.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      AdminEntity,
      UserEntity,
      ServiceEntity,
    ]),
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
