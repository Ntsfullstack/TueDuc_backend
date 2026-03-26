import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';
import { HomeworkTarget } from './homework-target.entity';

export enum HomeworkType {
  QUIZ = 'quiz',
  ESSAY = 'essay',
}

export enum HomeworkTargetScope {
  CLASS = 'class',
  STUDENTS = 'students',
}

@Entity('homeworks')
export class Homework {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: HomeworkType })
  type: HomeworkType;

  @Column({ name: 'due_at', type: 'timestamptz', nullable: true })
  dueAt: Date;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @Column({ name: 'class_id' })
  classId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column({
    name: 'target_scope',
    type: 'enum',
    enum: HomeworkTargetScope,
    default: HomeworkTargetScope.CLASS,
  })
  targetScope: HomeworkTargetScope;

  @Column({ type: 'jsonb', nullable: true })
  quiz: unknown;

  @OneToMany(() => HomeworkTarget, (t) => t.homework)
  targets: HomeworkTarget[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
