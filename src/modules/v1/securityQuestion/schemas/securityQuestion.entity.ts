import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import SecurityQuestionAnswerEntity from '@v1/account/schemas/securityQuestionAnswer.entity';

@Entity('securityQuestion')
export default class SecurityQuestionEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly question: string = '';

  @OneToMany(
    () => SecurityQuestionAnswerEntity,
    (object) => object.accountEntity,
    {
      cascade: true,
    },
  )
  securityQuestionAnswerEntities?: SecurityQuestionAnswerEntity[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
