import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';
import { AttendanceRecord } from './attendance-record.entity';
import { Shift } from '../../shifts/entities/shift.entity';
export declare class AttendanceSession {
    id: string;
    class: Class;
    classId: string;
    date: string;
    shift: Shift;
    shiftId: string;
    teacher: User;
    teacherId: string;
    records: AttendanceRecord[];
    createdAt: Date;
    updatedAt: Date;
}
