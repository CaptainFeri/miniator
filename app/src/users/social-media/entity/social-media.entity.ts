import { Column, Entity } from 'typeorm';
import { myBaseEntity } from '../../../common/entity/base.entity';
import { SocialMediaEnum } from '../type/social-medial.enum';

@Entity('SOCIAL_MEDIA')
export class SocialMediaEntity extends myBaseEntity {
  @Column()
  public type: SocialMediaEnum;

  @Column()
  public link: string;

  @Column()
  public userId: number;
}
