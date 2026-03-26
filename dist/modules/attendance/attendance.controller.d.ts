import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    mark(actor: CurrentUserData, dto: MarkAttendanceDto): Promise<import("./entities/attendance-session.entity").AttendanceSession | null>;
    getByClassDate(actor: CurrentUserData, classId: string, date: string, shiftId: string): Promise<import("./entities/attendance-session.entity").AttendanceSession | null>;
    getByStudent(actor: CurrentUserData, studentId: string): Promise<import("./entities/attendance-record.entity").AttendanceRecord[]>;
    adminSessions(actor: CurrentUserData, date: string, shiftId: string): Promise<import("./entities/attendance-session.entity").AttendanceSession[]>;
    adminUpdateSession(actor: CurrentUserData, sessionId: string, dto: UpdateAttendanceDto): Promise<import("./entities/attendance-session.entity").AttendanceSession>;
    adminEditLogs(actor: CurrentUserData, sessionId: string): Promise<import("./entities/attendance-edit-log.entity").AttendanceEditLog[]>;
}
