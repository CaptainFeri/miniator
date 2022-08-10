import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { TypesEnum } from '@decorators/types.decorator';
import CompanyRoleEntity from '@v1/company/schemas/companyRole.entity';
import CompanyRoleRequestEntity from '@v1/company/schemas/companyRoleRequest.entity';
import ProfileEntity from './profile.entity';
import CompanyProfileEntity from './companyProfile.entity';
import SecurityQuestionAnswerEntity from './securityQuestionAnswer.entity';

@Entity('account')
export default class AccountEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly username: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly email: string = '';

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  readonly password: string = '';

  @ApiProperty({ type: Boolean, default: false })
  @Column()
  readonly banned: boolean = false;

  @ApiProperty({ type: Boolean, default: false })
  @Column()
  readonly blocked: boolean = false;

  @ApiProperty({ type: Boolean, default: false })
  @Column()
  readonly verified: boolean = false;

  @ApiProperty({ type: String, default: TypesEnum.user, enum: TypesEnum })
  @Column({ type: 'enum', enum: TypesEnum, default: TypesEnum.user })
  readonly type: TypesEnum = TypesEnum.user;

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

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
