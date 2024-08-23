import { BaseEntity } from 'src/common/entities/base.entity';
import { Contact } from 'src/contact/entities/contact.entity';
import { ReportSpam } from 'src/report-spam/entities/report-spam.entity';
import { Entity, Column, OneToMany } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Contact, (contact) => contact.user)
  contacts: Contact[];

  @OneToMany(() => ReportSpam, (reportSpam) => reportSpam.reporter)
  reportSpam: ReportSpam[];
}