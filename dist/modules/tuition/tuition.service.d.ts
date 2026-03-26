import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Student } from '../students/entities/student.entity';
import { StudentTuitionPlan } from './entities/student-tuition-plan.entity';
import { TuitionPayment } from './entities/tuition-payment.entity';
export declare class TuitionService {
    private readonly planRepository;
    private readonly paymentRepository;
    private readonly studentRepository;
    constructor(planRepository: Repository<StudentTuitionPlan>, paymentRepository: Repository<TuitionPayment>, studentRepository: Repository<Student>);
    private assertCanAccessStudent;
    setStudentMonthlyFee(actor: CurrentUserData, studentId: string, monthlyFee: number): Promise<StudentTuitionPlan | null>;
    createPayment(actor: CurrentUserData, studentId: string, month: string, amount: number, method?: string, note?: string): Promise<TuitionPayment>;
    getStudentMonthSummary(actor: CurrentUserData, studentId: string, month: string): Promise<{
        studentId: string;
        month: string;
        due: number;
        paid: number;
        debt: number;
        status: string;
        payments: TuitionPayment[];
    }>;
    getParentSummary(actor: CurrentUserData, month: string): Promise<{
        studentId: string;
        month: string;
        due: number;
        paid: number;
        debt: number;
        status: string;
        payments: TuitionPayment[];
    }[]>;
    adminUnpaidList(actor: CurrentUserData, month: string, classId?: string): Promise<{
        studentId: string;
        studentName: string;
        classId: string;
        className: string;
        parentId: string;
        parentEmail: string;
        month: string;
        due: number;
        paid: number;
        debt: number;
        status: string;
    }[]>;
}
