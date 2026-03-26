import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
export declare class TuitionPayment {
    id: string;
    student: Student;
    studentId: string;
    month: string;
    amount: number;
    paidAt: Date;
    createdBy: User;
    createdById: string;
    method: string | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
}
