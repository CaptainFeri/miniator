import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import CompanyEntity from './company.entity';
import AccountEntity from '@v1/account/schemas/account.entity';
import CompanyRoleRequestEntity from './companyRoleRequest.entity';

@Entity('companyRole')
export default class CompanyRoleEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly title: string = '';

  @ApiProperty({ type: Boolean })
  @Column()
  readonly requestable: boolean = false;

  @ManyToOne(() => CompanyEntity, (object) => object.companyRoleEntities, {
    onDelete: 'CASCADE',
  })
  companyEntity?: CompanyEntity;

  @OneToMany(
    () => CompanyRoleRequestEntity,
    (object) => object.companyRoleEntity,
    {
      cascade: true,
    },
  )
  companyRoleRequestEntities?: CompanyRoleRequestEntity[];

  @ManyToMany(() => AccountEntity, (object) => object.companyRoleEntities)
  accountEntities?: AccountEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
