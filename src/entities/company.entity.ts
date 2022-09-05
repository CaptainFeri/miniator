import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { CompanyRoleEntity } from '@entities/company-role.entity';
import { BaseEntity } from '@entities/base.entity';
import { AdminEntity } from '@entities/admin.entity';

@Entity('company')
export class CompanyEntity extends BaseEntity {
  @Column({
    length: 64,
    unique: true,
  })
  readonly name: string;

  @Column()
  readonly minDeposit: number;

  @Column()
  readonly maxDeposit: number;

  @Column()
  readonly minWithdrawal: number;

  @Column()
  readonly maxWithdrawal: number;

  @Column()
  readonly maxCapacity: number;

  @OneToMany(() => CompanyRoleEntity, (object) => object.company, {
    cascade: true,
  })
  companyRoles?: CompanyRoleEntity[];

  @ManyToOne(() => AdminEntity, (object) => object.companies, {
    onDelete: 'CASCADE',
  })
  admin?: AdminEntity;
}
