import {
  Entity,
  Column,
  Index,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from 'src/modules/account/schemas/account.entity';
import CompanyEntity from './company.entity';

import { BaseEntity } from '@entities/base.entity';
import CompanyRoleRequestEntity from './company-role-request.entity';

@Entity('companyRole')
export default class CompanyRoleEntity extends BaseEntity {
  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly name: string = '';

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
}
