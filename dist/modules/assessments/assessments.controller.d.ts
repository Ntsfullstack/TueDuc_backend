import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentsService } from './assessments.service';
export declare class AssessmentsController {
    private readonly assessmentsService;
    constructor(assessmentsService: AssessmentsService);
    create(actor: CurrentUserData, dto: CreateAssessmentDto): Promise<import("./entities/assessment.entity").Assessment>;
    findByStudent(actor: CurrentUserData, studentId: string): Promise<import("./entities/assessment.entity").Assessment[]>;
    threeRoots(actor: CurrentUserData, studentId: string): Promise<{
        avgEthics: number;
        avgWisdom: number;
        avgWillpower: number;
        totalAssessments: number;
    } | null>;
    findById(actor: CurrentUserData, id: string): Promise<import("./entities/assessment.entity").Assessment>;
    update(actor: CurrentUserData, id: string, dto: UpdateAssessmentDto): Promise<import("./entities/assessment.entity").Assessment>;
}
