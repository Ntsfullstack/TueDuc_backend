import { Student } from '../../students/entities/student.entity';
import { User } from '../../users/entities/user.entity';
import { Homework } from './homework.entity';
export declare enum HomeworkSubmissionStatus {
    SUBMITTED = "submitted",
    GRADED = "graded"
}
export declare class HomeworkSubmission {
    id: string;
    homework: Homework;
    homeworkId: string;
    student: Student;
    studentId: string;
    parent: User;
    parentId: string;
    status: HomeworkSubmissionStatus;
    quizAnswers: unknown;
    attachments: unknown;
    score: number | null;
    feedback: string;
    submittedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
