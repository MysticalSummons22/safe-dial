import { PrimaryColumn, CreateDateColumn, UpdateDateColumn, Column, BeforeInsert } from 'typeorm';
import * as cuid from 'cuid';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  modifiedDate: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @BeforeInsert()
  generateId() {
    this.id = cuid();
  }
}