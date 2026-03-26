import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Course } from '../courses/entities/course.entity';
import { Student } from '../students/entities/student.entity';
import { Assessment } from './entities/assessment.entity';
export declare class AssessmentsService {
    private readonly assessmentRepository;
    private readonly studentRepository;
    private readonly courseRepository;
    constructor(assessmentRepository: Repository<Assessment>, studentRepository: Repository<Student>, courseRepository: Repository<Course>);
    create(actor: CurrentUserData, assessmentData: Partial<Assessment>): Promise<Assessment>;
    findAllByStudent(actor: CurrentUserData, studentId: string): Promise<Assessment[]>;
    findById(actor: CurrentUserData, id: string): Promise<Assessment>;
    update(actor: CurrentUserData, id: string, updateData: Partial<Assessment>): Promise<Assessment>;
    getThreeRootsSummary(actor: CurrentUserData, studentId: string): Promise<{
        avgEthics: number;
        avgWisdom: number;
        avgWillpower: number;
        totalAssessments: number;
    } | null>;
}
