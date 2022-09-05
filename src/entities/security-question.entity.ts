import { Entity, Column, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { SecurityQuestionAnswerEntity } from '@entities/securityQuestionAnswer.entity';

@Entity('securityQuestion')
export class SecurityQuestionEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly question: string;

  @OneToMany(() => SecurityQuestionAnswerEntity, (object) => object.account, {
    cascade: true,
  })
  securityQuestionAnswers?: SecurityQuestionAnswerEntity[];
}
