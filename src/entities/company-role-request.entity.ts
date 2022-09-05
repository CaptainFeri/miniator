import { Entity, Column, ManyToOne } from 'typeorm';
import { AccountEntity } from '@entities/account.entity';
import { CompanyRoleEntity } from '@entities/company-role.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companyRole')
export class CompanyRoleRequestEntity extends BaseEntity {
  @Column()
  readonly status: boolean = false;

  @Column({ type: 'timestamp with time zone' })
  readonly acceptedAt?: Date;

  @ManyToOne(() => CompanyRoleEntity, (object) => object.companyRoleRequests, {
    onDelete: 'CASCADE',
  })
  companyRole?: CompanyRoleEntity;

  @ManyToOne(() => AccountEntity, (object) => object.companyRoleRequests, {
    onDelete: 'CASCADE',
  })
  account?: AccountEntity;
}
