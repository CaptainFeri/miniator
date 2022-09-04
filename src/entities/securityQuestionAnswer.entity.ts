import { Entity, Column, Index, ManyToOne } from 'typeorm';
import AccountEntity from '@entities/account.entity';
import { BaseEntity } from '@entities/base.entity';
import SecurityQuestionEntity from '@entities/security-question.entity';

@Entity('securityQuestionAnswer')
export default class SecurityQuestionAnswerEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly answer: string = '';

  @ManyToOne(
    () => AccountEntity,
    (object) => object.securityQuestionAnswerEntities,
    {
      onDelete: 'CASCADE',
    },
  )
  accountEntity?: AccountEntity;

  @ManyToOne(
    () => SecurityQuestionEntity,
    (object) => object.securityQuestionAnswerEntities,
    {
      onDelete: 'CASCADE',
    },
  )
  securityQuestionEntity?: SecurityQuestionEntity;
}
