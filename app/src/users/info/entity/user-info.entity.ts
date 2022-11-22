import { Column, Entity } from 'typeorm';
import { myBaseEntity } from '../../../common/entity/base.entity';
import { GenderEnum } from '../enum/gender.enum';

@Entity('USER_INFO')
export class UserInfoEntity extends myBaseEntity {
  @Column({
    nullable: true,
  })
  public gender?: GenderEnum;

  @Column({
    nullable: true,
  })
  public birthday?: Date;

  @Column({
    nullable: true,
  })
  city?: string;

  @Column({
    nullable: true,
  })
  phone?: string;

  @Column({
    nullable: true,
  })
  firstname?: string;

  @Column({
    nullable: true,
  })
  lastname?: string;

  @Column({
    nullable: true,
  })
  nationalCode?: string;
}
