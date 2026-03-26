import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { StudentTuitionPlan } from '../tuition/entities/student-tuition-plan.entity';
import { TuitionPayment } from '../tuition/entities/tuition-payment.entity';
export declare class AdminService {
    private readonly classRepository;
    private readonly studentRepository;
    private readonly userRepository;
    private readonly attendanceSessionRepository;
    private readonly attendanceRecordRepository;
    private readonly tuitionPlanRepository;
    private readonly tuitionPaymentRepository;
    constructor(classRepository: Repository<Class>, studentRepository: Repository<Student>, userRepository: Repository<User>, attendanceSessionRepository: Repository<AttendanceSession>, attendanceRecordRepository: Repository<AttendanceRecord>, tuitionPlanRepository: Repository<StudentTuitionPlan>, tuitionPaymentRepository: Repository<TuitionPayment>);
    private todayDateString;
    private currentMonthString;
    dashboard(actor: CurrentUserData, month?: string, date?: string): Promise<{
        totals: {
            classes: number;
            students: number;
            teachers: number;
            activeClasses: number;
        };
        attendance: {
            date: string;
            sessions: number;
            totalRecords: number;
            presentRecords: number;
            rate: number;
        };
        tuition: {
            month: string;
            due: number;
            paid: number;
            debt: number;
        };
    }>;
}
