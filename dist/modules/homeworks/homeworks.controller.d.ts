import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { SubmitEssayDto } from './dto/submit-essay.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { HomeworksService } from './homeworks.service';
export declare class HomeworksController {
    private readonly homeworksService;
    constructor(homeworksService: HomeworksService);
    list(actor: CurrentUserData, studentId?: string): Promise<import("./entities/homework.entity").Homework[]>;
    create(actor: CurrentUserData, dto: CreateHomeworkDto): Promise<import("./entities/homework.entity").Homework>;
    findById(actor: CurrentUserData, id: string): Promise<import("./entities/homework.entity").Homework>;
    update(actor: CurrentUserData, id: string, dto: UpdateHomeworkDto): Promise<import("./entities/homework.entity").Homework>;
    status(actor: CurrentUserData, id: string): Promise<{
        studentId: string;
        studentName: string;
        status: string;
        score: number | null;
        submissionId: string | null;
    }[]>;
    submitQuiz(actor: CurrentUserData, id: string, dto: SubmitQuizDto): Promise<import("./entities/homework-submission.entity").HomeworkSubmission>;
    submitEssay(actor: CurrentUserData, id: string, dto: SubmitEssayDto, files: Array<Express.Multer.File>): Promise<import("./entities/homework-submission.entity").HomeworkSubmission>;
    submissions(actor: CurrentUserData, id: string): Promise<import("./entities/homework-submission.entity").HomeworkSubmission[]>;
    grade(actor: CurrentUserData, submissionId: string, dto: GradeSubmissionDto): Promise<import("./entities/homework-submission.entity").HomeworkSubmission | null>;
}
