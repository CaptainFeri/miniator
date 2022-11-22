import { myBaseEntity } from '../../common/entity/base.entity';
import { Column } from 'typeorm';

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
