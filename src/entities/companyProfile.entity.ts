import { Entity, Column, Index, OneToOne } from 'typeorm';
import { AccountEntity } from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companyProfile')
export class CompanyProfileEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly economicCode: string = '';

  @Column({ length: 64 })
  readonly registrationId: string = '';

  @Column({ length: 64 })
  readonly phone: string = '';

  @Column({ length: 64 })
  readonly activityField: string = '';

  @OneToOne(() => AccountEntity, (object) => object.companyProfile, {
    onDelete: 'CASCADE',
  })
  account?: AccountEntity;
}
