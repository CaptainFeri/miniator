import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from '../service/entity/service.entity';
import { UserEntity } from '../users/entity/users.entity';
import { SecurityQuestionEntity } from './entity/security.entity';
import { SecurityDocsEntity } from './entity/securityDocs.entity';
import { SecurityQService } from './security-q.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SecurityQuestionEntity,
      SecurityDocsEntity,
      ServiceEntity,
      UserEntity,
    ]),
  ],
  providers: [SecurityQService],
  exports: [SecurityQService],
})
export class SecurityQModule {}
