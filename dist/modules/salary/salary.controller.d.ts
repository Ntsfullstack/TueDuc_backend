import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { SetTeacherRateDto } from './dto/set-teacher-rate.dto';
import { SalaryService } from './salary.service';
export declare class SalaryController {
    private readonly salaryService;
    constructor(salaryService: SalaryService);
    setRate(actor: CurrentUserData, teacherId: string, dto: SetTeacherRateDto): Promise<import("./entities/teacher-salary-rate.entity").TeacherSalaryRate | null>;
    listRates(actor: CurrentUserData, teacherId: string): Promise<import("./entities/teacher-salary-rate.entity").TeacherSalaryRate[]>;
    teacherSalary(actor: CurrentUserData, teacherId: string, month: string): Promise<{
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
    mySalary(actor: CurrentUserData, month: string): Promise<{
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
