import {
  Entity,
  Column,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import ProfileEntity from './profile.entity';
import CompanyProfileEntity from './companyProfile.entity';
import SecurityQuestionAnswerEntity from './securityQuestionAnswer.entity';
import { BaseEntity } from '@entities/base.entity';
import CompanyRoleRequestEntity from '@entities/company-role-request.entity';
import CompanyRoleEntity from '@entities/company-role.entity';

@Entity('account')
export default class AccountEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly username: string = '';

  @Column({ length: 64 })
  @Index({ unique: true })
  readonly email: string = '';

  @Column({ length: 64 })
  readonly password: string = '';

  @Column()
  readonly banned: boolean = false;

  @Column()
  readonly blocked: boolean = false;

  @Column()
  readonly verified: boolean = false;

  @OneToOne(() => ProfileEntity, (object) => object.accountEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'profile_fk' })
  profileEntity?: ProfileEntity;

  @OneToOne(() => CompanyProfileEntity, (object) => object.accountEntity, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'company_profile_fk' })
  companyProfileEntity?: CompanyProfileEntity;

  @OneToMany(
    () => SecurityQuestionAnswerEntity,
    (object) => object.accountEntity,
    {
      cascade: true,
    },
  )
  securityQuestionAnswerEntities?: SecurityQuestionAnswerEntity[];

  @OneToMany(() => CompanyRoleRequestEntity, (object) => object.accountEntity, {
    cascade: true,
  })
  companyRoleRequestEntities?: CompanyRoleRequestEntity[];

  @ManyToMany(() => CompanyRoleEntity, (object) => object.accountEntities, {
    cascade: true,
  })
  @JoinTable({
    name: 'accountCompanyRole',
    joinColumn: {
      name: 'account_fk',
    },
    inverseJoinColumn: {
      name: 'companyRole_fk',
    },
  })
  companyRoleEntities?: CompanyRoleEntity[];
}
