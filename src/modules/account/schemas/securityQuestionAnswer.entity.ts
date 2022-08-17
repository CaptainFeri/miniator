import { Entity, Column, Index, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from './account.entity';
import { BaseEntity } from '@entities/base.entity';
import SecurityQuestionEntity from 'src/modules/security-question/schemas/security-question.entity';

@Entity('securityQuestionAnswer')
export default class SecurityQuestionAnswerEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    maxLength: 64,
  })
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
