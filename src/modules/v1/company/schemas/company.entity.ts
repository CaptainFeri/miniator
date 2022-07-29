import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import CompanyRoleEntity from './companyRole.entity';

@Entity('company')
export default class CompanyEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly name: string = '';

  @ApiProperty({ type: Number })
  readonly minDeposit: number = 0;

  @ApiProperty({ type: Number })
  readonly maxDeposit: number = 0;

  @ApiProperty({ type: Number })
  readonly minWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  readonly maxWithdrawal: number = 0;

  @ApiProperty({ type: Number })
  readonly maxCapacity: number = 0;

  @OneToMany(
    () => CompanyRoleEntity,
    (object) => object.companyEntity,
    {
      cascade: true,
    },
  )
  companyRoleEntities?: CompanyRoleEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
