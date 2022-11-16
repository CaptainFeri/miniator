import { ServiceEntity } from 'src/service/entity/service.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';

@Entity('ROLE')
export class RoleEntity extends myBaseEntity {
  @Column()
  public title: string;

  @Column()
  public createBy: string;

  @Column({
    default: false,
  })
  public vip: boolean = false;

  @ManyToMany(() => ServiceEntity, (service: ServiceEntity) => service.roles)
  @JoinTable({
    name: 'ROLE_SERVICES',
    joinColumn: {
      name: 'roleId',
      referencedColumnName: 'id',
    },
  })
  public services: ServiceEntity[];
}
