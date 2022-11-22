import { ServiceEntity } from 'src/service/entity/service.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';

@Entity('SECURITY_DOCS')
export class SecurityDocsEntity extends myBaseEntity {
  @Column()
  title: string;

  @ManyToOne(() => ServiceEntity, (serv: ServiceEntity) => serv.questions, {
    eager: true,
    cascade: true,
  })
  service: ServiceEntity;
}
