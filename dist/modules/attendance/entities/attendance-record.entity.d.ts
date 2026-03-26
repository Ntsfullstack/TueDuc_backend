import { Student } from '../../students/entities/student.entity';
import { AttendanceSession } from './attendance-session.entity';
export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late",
    EXCUSED = "excused"
}
export declare class AttendanceRecord {
    id: string;
    session: AttendanceSession;
    sessionId: string;
    student: Student;
    studentId: string;
    status: AttendanceStatus;
    note: string;
    createdAt: Date;
    updatedAt: Date;
}
