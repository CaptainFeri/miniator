import { myBaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('ADMIN')
export class AdminEntity extends myBaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;
}
