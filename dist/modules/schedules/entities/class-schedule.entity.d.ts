import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class ClassSchedule {
    id: string;
    class: Class;
    classId: string;
    weekday: number;
    shift: Shift;
    shiftId: string;
    teacher: User;
    teacherId: string;
    createdAt: Date;
    updatedAt: Date;
}
