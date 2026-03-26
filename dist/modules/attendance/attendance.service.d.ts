import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceSession } from './entities/attendance-session.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceEditLog } from './entities/attendance-edit-log.entity';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
export declare class AttendanceService {
    private readonly sessionRepository;
    private readonly recordRepository;
    private readonly classRepository;
    private readonly studentRepository;
    private readonly editLogRepository;
    constructor(sessionRepository: Repository<AttendanceSession>, recordRepository: Repository<AttendanceRecord>, classRepository: Repository<Class>, studentRepository: Repository<Student>, editLogRepository: Repository<AttendanceEditLog>);
    mark(actor: CurrentUserData, dto: MarkAttendanceDto): Promise<AttendanceSession | null>;
    getByClassDate(actor: CurrentUserData, classId: string, date: string, shiftId: string): Promise<AttendanceSession | null>;
    getByStudent(actor: CurrentUserData, studentId: string): Promise<AttendanceRecord[]>;
    adminListSessions(actor: CurrentUserData, date: string, shiftId: string): Promise<AttendanceSession[]>;
    adminUpdateSession(actor: CurrentUserData, sessionId: string, dto: UpdateAttendanceDto): Promise<AttendanceSession>;
    adminEditLogs(actor: CurrentUserData, sessionId: string): Promise<AttendanceEditLog[]>;
}
