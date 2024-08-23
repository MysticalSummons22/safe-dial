import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class Contact extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.contacts)
  user: User;
}