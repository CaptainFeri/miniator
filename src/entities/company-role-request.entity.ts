import { Entity, Column, ManyToOne } from 'typeorm';
import AccountEntity from '@entities/account.entity';
import CompanyRoleEntity from '@entities/company-role.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companyRole')
export default class CompanyRoleRequestEntity extends BaseEntity {
  @Column()
  readonly status: boolean = false;

  @Column({ type: 'timestamp with time zone' })
  readonly acceptedAt?: Date;

  @ManyToOne(
    () => CompanyRoleEntity,
    (object) => object.companyRoleRequestEntities,
    {
      onDelete: 'CASCADE',
    },
  )
  companyRoleEntity?: CompanyRoleEntity;

  @ManyToOne(
    () => AccountEntity,
    (object) => object.companyRoleRequestEntities,
    {
      onDelete: 'CASCADE',
    },
  )
  accountEntity?: AccountEntity;
}
