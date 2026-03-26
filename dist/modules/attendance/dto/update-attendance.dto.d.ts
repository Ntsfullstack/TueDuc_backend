import { AttendanceStatus } from '../entities/attendance-record.entity';
export declare class AttendanceRecordPatchDto {
    studentId: string;
    status: AttendanceStatus;
    note?: string;
}
export declare class UpdateAttendanceDto {
    reason?: string;
    records: AttendanceRecordPatchDto[];
}
