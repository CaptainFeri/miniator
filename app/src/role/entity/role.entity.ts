import { ServiceEntity } from 'src/service/entity/service.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => ServiceEntity, (service: ServiceEntity) => service.roles, {
    eager: true,
    cascade: true,
  })
  public service: ServiceEntity;
}
