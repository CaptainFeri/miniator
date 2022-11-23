import { myBaseEntity } from '../../common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('WALLET')
export class WalletEntity extends myBaseEntity {
  @Column()
  serviceId: number;

  @Column()
  roleId: number;

  @Column()
  userId: number;

  @Column()
  currencyId: number;
}
