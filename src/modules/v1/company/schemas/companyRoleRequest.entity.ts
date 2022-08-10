import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from '@v1/account/schemas/account.entity';
import CompanyRoleEntity from './companyRole.entity';

@Entity('companyRole')
export default class CompanyRoleRequestEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: Boolean })
  @Column()
  readonly status: boolean = false;

  @ApiProperty({ type: 'timestamp with time zone' })
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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
