import { Entity, Column, Index, OneToOne } from 'typeorm';
import { AccountEntity } from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
}

@Entity('profile')
export class ProfileEntity extends BaseEntity {
  @Column({ length: 10 })
  @Index({ unique: true })
  readonly nationalCode: string = '';

  @Column({ length: 64 })
  readonly firstName: string = '';

  @Column({ length: 64 })
  readonly lastName: string = '';

  @Column({
    type: 'enum',
    enum: GenderEnum,
    default: GenderEnum.Male,
  })
  readonly gender: GenderEnum = GenderEnum.Male;

  @Column({ length: 64 })
  readonly phone: string = '';

  @Column('jsonb', { nullable: true })
  readonly socialMedia: object[];

  @Column({ length: 64 })
  readonly city: string = '';

  @Column({ length: 64 })
  readonly job: string = '';

  @Column('timestamp with time zone')
  readonly birthday: Date = new Date();

  @OneToOne(() => AccountEntity, (object) => object.profile, {
    onDelete: 'CASCADE',
  })
  account?: AccountEntity;
}
