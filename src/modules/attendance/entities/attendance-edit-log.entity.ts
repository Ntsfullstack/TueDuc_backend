import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AttendanceSession } from './attendance-session.entity';

@Entity('attendance_edit_logs')
export class AttendanceEditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => AttendanceSession)
  @JoinColumn({ name: 'session_id' })
  session: AttendanceSession;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'editor_id' })
  editor: User;

  @Column({ name: 'editor_id' })
  editorId: string;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @Column({ type: 'jsonb' })
  before: unknown;

  @Column({ type: 'jsonb' })
  after: unknown;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
