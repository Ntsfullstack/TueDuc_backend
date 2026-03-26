import { Student } from '../../students/entities/student.entity';
export declare class StudentTuitionPlan {
    id: string;
    student: Student;
    studentId: string;
    monthlyFee: number;
    createdAt: Date;
    updatedAt: Date;
}
