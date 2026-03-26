import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { SchedulesService } from './schedules.service';
export declare class SchedulesController {
    private readonly schedulesService;
    constructor(schedulesService: SchedulesService);
    createClassSchedule(actor: CurrentUserData, dto: CreateClassScheduleDto): Promise<import("./entities/class-schedule.entity").ClassSchedule | null>;
    listByClass(actor: CurrentUserData, classId: string): Promise<import("./entities/class-schedule.entity").ClassSchedule[]>;
    studentSchedule(actor: CurrentUserData, studentId: string, date: string): Promise<import("./entities/class-schedule.entity").ClassSchedule[]>;
    teacherSchedule(actor: CurrentUserData, date: string): Promise<import("./entities/class-schedule.entity").ClassSchedule[]>;
    teacherScheduleById(actor: CurrentUserData, teacherId: string, date: string): Promise<import("./entities/class-schedule.entity").ClassSchedule[]>;
    centerWeek(actor: CurrentUserData, start: string): Promise<{
        start: string;
        items: import("./entities/class-schedule.entity").ClassSchedule[];
    }>;
}
