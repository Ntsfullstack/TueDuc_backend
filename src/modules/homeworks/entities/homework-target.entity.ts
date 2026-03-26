import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Homework } from './homework.entity';

@Entity('homework_targets')
@Unique(['homeworkId', 'studentId'])
export class HomeworkTarget {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Homework, (h) => h.targets)
  @JoinColumn({ name: 'homework_id' })
  homework: Homework;

  @Column({ name: 'homework_id' })
  homeworkId: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
