import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@entities/base.entity';

@Entity('walletType')
export class WalletTypeEntity extends BaseEntity {
  @Column({ length: 64 })
  @Index({ unique: true })
  readonly name: string = '';
}
