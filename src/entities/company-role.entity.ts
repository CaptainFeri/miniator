import {
  Entity,
  Column,
  Index,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import AccountEntity from '@entities/account.entity';
import CompanyEntity from './company.entity';

import { BaseEntity } from '@entities/base.entity';
import CompanyRoleRequestEntity from '@entities/company-role-request.entity';

@Entity('companyRole')
export default class CompanyRoleEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly name: string = '';

  @Column()
  readonly isSpecial: boolean = false;

  @ManyToOne(() => CompanyEntity, (object) => object.companyRoles, {
    onDelete: 'CASCADE',
  })
  company?: CompanyEntity;

  @OneToMany(() => CompanyRoleRequestEntity, (object) => object.companyRole, {
    cascade: true,
  })
  companyRoleRequests?: CompanyRoleRequestEntity[];

  @ManyToMany(() => AccountEntity, (object) => object.companyRoles)
  accounts?: AccountEntity[];
}
