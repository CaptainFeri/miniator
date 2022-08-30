import { Entity, Column, Index, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('companyProfile')
export default class CompanyProfileEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly economicCode: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly registrationId: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly phone: string = '';

  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  readonly activityField: string = '';

  @OneToOne(() => AccountEntity, (object) => object.companyProfileEntity, {
    onDelete: 'CASCADE',
  })
  accountEntity?: AccountEntity;
}
