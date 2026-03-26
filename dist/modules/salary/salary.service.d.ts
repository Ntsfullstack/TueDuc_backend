import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { User } from '../users/entities/user.entity';
import { TeacherSalaryRate } from './entities/teacher-salary-rate.entity';
export declare class SalaryService {
    private readonly rateRepository;
    private readonly scheduleRepository;
    private readonly shiftRepository;
    private readonly userRepository;
    constructor(rateRepository: Repository<TeacherSalaryRate>, scheduleRepository: Repository<ClassSchedule>, shiftRepository: Repository<Shift>, userRepository: Repository<User>);
    private parseMonth;
    private countWeekdayInMonth;
    setTeacherRate(actor: CurrentUserData, teacherId: string, shiftId: string, amountPerSession: number): Promise<TeacherSalaryRate | null>;
    listTeacherRates(actor: CurrentUserData, teacherId: string): Promise<TeacherSalaryRate[]>;
    getTeacherSalaryByMonth(actor: CurrentUserData, teacherId: string, month: string): Promise<{
        teacherId: string;
        month: string;
        totalSessions: number;
        totalAmount: number;
        breakdown: {
            classId: string;
            className: string;
            weekday: number;
            shiftId: string;
            shiftName: string;
            sessions: number;
            rate: number;
            amount: number;
        }[];
    }>;
}
