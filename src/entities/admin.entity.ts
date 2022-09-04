import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import CompanyEntity from '@entities/company.entity';

@Entity('admin')
export default class AdminEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly username: string = '';

  @Column({ length: 64 })
  @Index({ unique: true })
  readonly email: string = '';

  @Column({ length: 64 })
  readonly password: string = '';

  @OneToMany(() => CompanyEntity, (object) => object.admin, {
    cascade: true,
  })
  companies!: CompanyEntity[];
}
