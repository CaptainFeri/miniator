import { Entity, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from '@entities/account.entity';
import CompanyRoleEntity from '@entities/company-role.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companyRole')
export default class CompanyRoleRequestEntity extends BaseEntity {
  @ApiProperty({ type: Boolean })
  @Column()
  readonly status: boolean = false;

  @ApiProperty({ type: 'timestamp with time zone' })
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
