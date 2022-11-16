import { AdminEntity } from '../../admin/entity/admin.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';
import { UserEntity } from '../../users/entity/users.entity';

@Entity('SERVICE')
export class ServiceEntity extends myBaseEntity {
  @Column()
  public title: string;

  @ManyToOne(() => AdminEntity, (admin: AdminEntity) => admin.services, {
    eager: true,
    cascade: true,
  })
  public admin: AdminEntity;

  @Column()
  public assignTime: Date;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.services)
  public users: UserEntity[];

  public roles: any[];

  @Column()
  public status: boolean;
}
