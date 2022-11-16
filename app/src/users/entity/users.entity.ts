import { ServiceEntity } from 'src/service/entity/service.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';

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
}
