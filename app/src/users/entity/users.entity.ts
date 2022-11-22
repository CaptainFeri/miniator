import { Exclude } from 'class-transformer';
import { Profile } from 'passport';
import { SecurityQuestionEntity } from 'src/security-q/entity/security.entity';
import { ServiceEntity } from 'src/service/entity/service.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';
import { UserInfoEntity } from '../info/entity/user-info.entity';

@Entity('USERS')
export class UserEntity extends myBaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: true,
  })
  createdBy?: string;

  @ManyToMany(() => ServiceEntity, (service: ServiceEntity) => service.users)
  @JoinTable({
    name: 'USER_SERVICES',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  public services: ServiceEntity[];

  @OneToMany(
    () => SecurityQuestionEntity,
    (sq: SecurityQuestionEntity) => sq.user,
  )
  public sqs: SecurityQuestionEntity[];

  @Column()
  public profileId: number;
}
