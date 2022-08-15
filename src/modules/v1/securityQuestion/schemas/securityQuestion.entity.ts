import { Entity, Column, Index, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import SecurityQuestionAnswerEntity from '@v1/account/schemas/securityQuestionAnswer.entity';
import { BaseEntity } from '@entities/base.entity';

@Entity('securityQuestion')
export default class SecurityQuestionEntity extends BaseEntity {
  @ApiProperty({
    type: String,
    maxLength: 64,
  })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly question: string;

  @OneToMany(
    () => SecurityQuestionAnswerEntity,
    (object) => object.accountEntity,
    {
      cascade: true,
    },
  )
  securityQuestionAnswerEntities?: SecurityQuestionAnswerEntity[];
}
