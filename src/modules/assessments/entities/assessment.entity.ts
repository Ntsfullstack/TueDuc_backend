import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';

@Entity('assessments')
export class Assessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @Column({ name: 'student_id' })
  studentId: string;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({ name: 'course_id' })
  courseId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @Column({
    name: 'ethics_score',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  ethicsScore: number;

  @Column({
    name: 'wisdom_score',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  wisdomScore: number;

  @Column({
    name: 'willpower_score',
    type: 'decimal',
    precision: 3,
    scale: 1,
    nullable: true,
  })
  willpowerScore: number;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ name: 'assessment_date', type: 'date' })
  assessmentDate: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
