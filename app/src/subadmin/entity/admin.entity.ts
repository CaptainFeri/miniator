import { myBaseEntity } from 'src/common/entity/base.entity';
import { ServiceEntity } from 'src/service/entity/service.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('ADMIN')
export class AdminEntity extends myBaseEntity {
  @Column()
  username: string;

  @Column()
  password: string;

  @OneToMany(() => ServiceEntity, (service: ServiceEntity) => service.admin)
  public services: ServiceEntity[];
}
