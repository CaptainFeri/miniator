import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from './account.entity';

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
}

@Entity('profile')
export default class ProfileEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 10 })
  @Column({ length: 10 })
  @Index({ unique: true })
  readonly nationalCode: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly firstName: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly lastName: string = '';

  @ApiProperty({ type: String, default: GenderEnum.Male, enum: GenderEnum })
  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.Male })
  readonly gender: GenderEnum = GenderEnum.Male;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly phone: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly socilaMedia: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly city: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly job: string = '';

  @ApiProperty({ type: Date, nullable: true })
  @Column({ length: 64 })
  readonly birthday: Date = new Date();

  @OneToOne(() => AccountEntity, (object) => object.profileEntity, {
    onDelete: 'CASCADE',
  })
  accountEntity?: AccountEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
