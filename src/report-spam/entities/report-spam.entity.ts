// src/report-spam/report-spam.entity.ts
import { BaseEntity } from 'src/common/entities/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity()
export class ReportSpam extends BaseEntity {
  @Column()
  phoneNumber: string;

  @Column({nullable: true})
  reason: string;

  @ManyToOne(() => User, (user) => user.reportSpam)
  reporter: User;
}