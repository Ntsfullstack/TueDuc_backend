import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { HomeworkSubmission } from './homework-submission.entity';

@Entity('homework_submission_comments')
export class HomeworkSubmissionComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HomeworkSubmission, (submission) => submission.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'submission_id' })
  submission: HomeworkSubmission;

  @Column({ name: 'submission_id' })
  submissionId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
