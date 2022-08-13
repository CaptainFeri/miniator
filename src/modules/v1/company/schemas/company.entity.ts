import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import CompanyRoleEntity from './companyRole.entity';
import AdminEntity from '@v1/admin/schemas/admin.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('company')
export default class CompanyEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly name: string = '';

  @ApiProperty({ type: Number })
  @Column()
  readonly minDeposit: number = 0;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxDeposit: number = 0;

  @ApiProperty({ type: Number })
  @Column()
  readonly minWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxCapacity: number = 0;

  @OneToMany(() => CompanyRoleEntity, (object) => object.companyEntity, {
    cascade: true,
  })
  companyRoleEntities?: CompanyRoleEntity[];

  @ManyToOne(() => AdminEntity, (object) => object.companies, {
    onDelete: 'CASCADE',
  })
  admin?: AdminEntity;
}
