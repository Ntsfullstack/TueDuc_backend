import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { ClassSchedule } from './entities/class-schedule.entity';
export declare class SchedulesService {
    private readonly scheduleRepository;
    private readonly classRepository;
    private readonly studentRepository;
    private readonly userRepository;
    private readonly shiftRepository;
    constructor(scheduleRepository: Repository<ClassSchedule>, classRepository: Repository<Class>, studentRepository: Repository<Student>, userRepository: Repository<User>, shiftRepository: Repository<Shift>);
    createClassSchedule(actor: CurrentUserData, dto: CreateClassScheduleDto): Promise<ClassSchedule | null>;
    listByClass(actor: CurrentUserData, classId: string): Promise<ClassSchedule[]>;
    private weekdayFromDate;
    getStudentScheduleByDate(actor: CurrentUserData, studentId: string, date: string): Promise<ClassSchedule[]>;
    getTeacherScheduleByDate(actor: CurrentUserData, date: string): Promise<ClassSchedule[]>;
    getTeacherScheduleByDateForTeacher(actor: CurrentUserData, teacherId: string, date: string): Promise<ClassSchedule[]>;
    private parseStartDate;
    getCenterScheduleWeek(actor: CurrentUserData, start: string): Promise<{
        start: string;
        items: ClassSchedule[];
    }>;
}
