import { Entity, Column, Index, ManyToOne } from 'typeorm';
import AccountEntity from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';
import SecurityQuestionEntity from '@entities/security-question.entity';

@Entity('securityQuestionAnswer')
export default class SecurityQuestionAnswerEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly answer: string = '';

  @ManyToOne(() => AccountEntity, (object) => object.securityQuestionAnswers, {
    onDelete: 'CASCADE',
  })
  account?: AccountEntity;

  @ManyToOne(
    () => SecurityQuestionEntity,
    (object) => object.securityQuestionAnswers,
    {
      onDelete: 'CASCADE',
    },
  )
  securityQuestion?: SecurityQuestionEntity;
}
