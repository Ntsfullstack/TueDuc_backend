import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';

export enum ClassStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  PAUSED = 'paused',
}

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  grade: string;

  @Column({ name: 'academic_year' })
  academicYear: string;

  @Column({ type: 'enum', enum: ClassStatus, default: ClassStatus.OPEN })
  status: ClassStatus;

  @Column({ name: 'max_students', type: 'int', nullable: true })
  maxStudents: number | null;

  @Column({ name: 'archived_at', type: 'timestamptz', nullable: true })
  archivedAt: Date | null;

  @Column({ name: 'cloned_from_id', type: 'uuid', nullable: true })
  clonedFromId: string | null;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'homeroom_teacher_id' })
  homeroomTeacher: User;

  @Column({ name: 'homeroom_teacher_id', nullable: true })
  homeroomTeacherId: string;

  @OneToMany(() => Student, (student) => student.class)
  students: Student[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
