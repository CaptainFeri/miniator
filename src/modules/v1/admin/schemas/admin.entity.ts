import { Entity, Column, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import CompanyEntity from '@v1/company/schemas/company.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('admin')
export default class AdminEntity extends BaseEntity {
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

  @OneToMany(() => CompanyEntity, (object) => object.admin, {
    cascade: true,
  })
  companies!: CompanyEntity[];
}
