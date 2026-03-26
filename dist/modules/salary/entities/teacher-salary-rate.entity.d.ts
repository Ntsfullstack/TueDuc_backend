import { User } from '../../users/entities/user.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class TeacherSalaryRate {
    id: string;
    teacher: User;
    teacherId: string;
    shift: Shift;
    shiftId: string;
    amountPerSession: number;
    createdAt: Date;
    updatedAt: Date;
}
