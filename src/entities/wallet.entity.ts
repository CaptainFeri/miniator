import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import WalletTypeEntity from '@entities/wallet-type.entity';
import AccountEntity from '@entities/account.entity';
import CompanyRoleEntity from '@entities/company-role.entity';

@Entity('wallet')
export default class WalletEntity extends BaseEntity {
  @ManyToOne(() => AccountEntity)
  account: AccountEntity;

  @ManyToOne(() => WalletTypeEntity)
  type: WalletTypeEntity;

  @ManyToOne(() => CompanyRoleEntity)
  role: CompanyRoleEntity;
}
