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
  @Column({ length: 64, unique: true })
  readonly name: string;

  @ApiProperty({ type: Number })
  @Column()
  readonly minDeposit: number;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxDeposit: number;

  @ApiProperty({ type: Number })
  @Column()
  readonly minWithdrawal: number;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxWithdrawal: number;

  @ApiProperty({ type: Number })
  @Column()
  readonly maxCapacity: number;

  @OneToMany(() => CompanyRoleEntity, (object) => object.companyEntity, {
    cascade: true,
  })
  companyRoleEntities?: CompanyRoleEntity[];

  @ManyToOne(() => AdminEntity, (object) => object.companies, {
    onDelete: 'CASCADE',
  })
  admin?: AdminEntity;
}
