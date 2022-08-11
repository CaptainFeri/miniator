import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import CompanyEntity from '@v1/company/schemas/company.entity';

@Entity('admin')
export default class AdminEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly username: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly email: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly password: string = '';

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  readonly createdAt: Date = new Date();

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp with time zone',
  })
  readonly updatedAt: Date = new Date();

  @OneToMany(() => CompanyEntity, (object) => object.admin, {
    cascade: true,
  })
  companies!: CompanyEntity[];
}