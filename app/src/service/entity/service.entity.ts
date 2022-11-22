import { AdminEntity } from '../../admin/entity/admin.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { myBaseEntity } from '../../common/entity/base.entity';
import { UserEntity } from '../../users/entity/users.entity';
import { RoleEntity } from 'src/role/entity/role.entity';
import { SecurityDocsEntity } from 'src/security-q/entity/securityDocs.entity';

@Entity('SERVICE')
export class ServiceEntity extends myBaseEntity {
  @Column()
  public minDeposit: string;

  @Column()
  public maxDeposit: string;

  @Column()
  public minWithdrawal: string;

  @Column()
  public maxWithdrawal: string;

  @Column()
  public maxCapacity: string;

  @Column()
  public title: string;

  @ManyToOne(() => AdminEntity, (admin: AdminEntity) => admin.services, {
    eager: true,
    cascade: true,
  })
  public admin: AdminEntity;

  @Column()
  public assignTime: Date;

  @ManyToMany(() => UserEntity, (user: UserEntity) => user.services)
  public users: UserEntity[];

  @ManyToOne(() => RoleEntity, (role: RoleEntity) => role.service)
  public roles: RoleEntity[];

  @Column()
  public status: boolean;

  @OneToMany(() => SecurityDocsEntity, (sec: SecurityDocsEntity) => sec.service)
  questions: SecurityDocsEntity[];
}
