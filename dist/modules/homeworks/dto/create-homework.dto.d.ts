import { HomeworkTargetScope, HomeworkType } from '../entities/homework.entity';
export declare class QuizQuestionDto {
    prompt: string;
    options: string[];
    correctIndex: number;
}
export declare class CreateHomeworkDto {
    title: string;
    description?: string;
    type: HomeworkType;
    dueAt?: string;
    classId: string;
    targetScope: HomeworkTargetScope;
    studentIds?: string[];
    quizQuestions?: QuizQuestionDto[];
    teacherId?: string;
}
