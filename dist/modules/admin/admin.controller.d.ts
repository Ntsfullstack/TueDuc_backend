import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
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
