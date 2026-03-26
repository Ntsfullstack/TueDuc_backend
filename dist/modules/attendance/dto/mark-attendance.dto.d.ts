import { AttendanceStatus } from '../entities/attendance-record.entity';
export declare class AttendanceRecordInputDto {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
}
export declare class MarkAttendanceDto {
    classId: string;
    date: string;
    shiftId: string;
    records: AttendanceRecordInputDto[];
}
