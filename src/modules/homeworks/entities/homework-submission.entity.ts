import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { Homework } from './homework.entity';

export enum HomeworkSubmissionStatus {
  SUBMITTED = 'submitted',
  GRADED = 'graded',
}

@Entity('homework_submissions')
@Unique(['homeworkId', 'studentId'])
export class HomeworkSubmission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homework)
  @JoinColumn({ name: 'homework_id' })
  homework: Homework;

  @Column({ name: 'homework_id' })
  homeworkId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'parent_id' })
  parent: User;

  @Column({ name: 'parent_id' })
  parentId: string;

  @Column({
    type: 'enum',
    enum: HomeworkSubmissionStatus,
    default: HomeworkSubmissionStatus.SUBMITTED,
  })
  status: HomeworkSubmissionStatus;

  @Column({ type: 'jsonb', nullable: true })
  quizAnswers: unknown;

  @Column({ type: 'jsonb', nullable: true })
  attachments: unknown;

  @Column({ type: 'decimal', precision: 4, scale: 1, nullable: true })
  score: number | null;

  @Column({ type: 'text', nullable: true })
  feedback: string;

  @Column({ name: 'submitted_at', type: 'timestamptz', default: () => 'now()' })
  submittedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
