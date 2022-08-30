import { Entity, Column, Index, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
}

@Entity('profile')
export default class ProfileEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    maxLength: 10,
  })
  @Column({ length: 10 })
  @Index({ unique: true })
  readonly nationalCode: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly firstName: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly lastName: string = '';

  @ApiProperty({
    type: String,
    default: GenderEnum.Male,
    enum: GenderEnum,
  })
  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.Male,
  })
  readonly gender: GenderEnum = GenderEnum.Male;

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly phone: string = '';


  @Column('jsonb', { nullable: true })
  readonly socilaMedia: object[];

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly city: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly job: string = '';

  @ApiProperty({
    type: Date,
    nullable: true,
  })
  @Column('timestamp with time zone')
  readonly birthday: Date = new Date();

  @OneToOne(() => AccountEntity, (object) => object.profileEntity, {
    onDelete: 'CASCADE',
  })
  accountEntity?: AccountEntity;
}
