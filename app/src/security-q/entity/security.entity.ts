import { UserEntity } from 'src/users/entity/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';

@Entity('SECURITY_QUESTION')
export class SecurityQuestionEntity extends myBaseEntity {
  @Column()
  public questionId: number;

  @Column()
  public answer: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.sqs, {
    eager: true,
    cascade: true,
  })
  public user: UserEntity;
}
