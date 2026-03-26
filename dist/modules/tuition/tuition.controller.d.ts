import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateTuitionPaymentDto } from './dto/create-tuition-payment.dto';
import { SetStudentTuitionDto } from './dto/set-student-tuition.dto';
import { TuitionService } from './tuition.service';
export declare class TuitionController {
    private readonly tuitionService;
    constructor(tuitionService: TuitionService);
    setPlan(actor: CurrentUserData, studentId: string, dto: SetStudentTuitionDto): Promise<import("./entities/student-tuition-plan.entity").StudentTuitionPlan | null>;
    createPayment(actor: CurrentUserData, studentId: string, dto: CreateTuitionPaymentDto): Promise<import("./entities/tuition-payment.entity").TuitionPayment>;
    studentMonth(actor: CurrentUserData, studentId: string, month: string): Promise<{
        studentId: string;
        month: string;
        due: number;
        paid: number;
        debt: number;
        status: string;
        payments: import("./entities/tuition-payment.entity").TuitionPayment[];
    }>;
    parentMonth(actor: CurrentUserData, month: string): Promise<{
        studentId: string;
        month: string;
        due: number;
        paid: number;
        debt: number;
        status: string;
        payments: import("./entities/tuition-payment.entity").TuitionPayment[];
    }[]>;
    unpaid(actor: CurrentUserData, month: string, classId?: string): Promise<{
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
    remind(actor: CurrentUserData, month: string, classId?: string): Promise<{
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
