import { Student } from '../../students/entities/student.entity';
import { Homework } from './homework.entity';
export declare class HomeworkTarget {
    id: string;
    homework: Homework;
    homeworkId: string;
    student: Student;
    studentId: string;
    createdAt: Date;
}
