import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import AccountEntity from './account.entity';
import SecurityQuestionEntity from '@v1/securityQuestion/schemas/securityQuestion.entity';

@Entity('securityQuestionAnswer')
export default class SecurityQuestionAnswerEntity {
  @ApiProperty({ type: String })
  @PrimaryGeneratedColumn()
  readonly id: number = 1;

  @ApiProperty({ type: String, maxLength: 64 })
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly answer: string = '';

  @ManyToOne(() => AccountEntity, (object) => object.securityQuestionAnswerEntities, {
    onDelete: 'CASCADE',
  })
  accountEntity?: AccountEntity;

  @ManyToOne(() => SecurityQuestionEntity, (object) => object.securityQuestionAnswerEntities, {
    onDelete: 'CASCADE',
  })
  securityQuestionEntity?: SecurityQuestionEntity;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  readonly createdAt: Date = new Date();
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
  readonly updatedAt: Date = new Date();
}
