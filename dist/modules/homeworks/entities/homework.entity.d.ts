import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';
import { HomeworkTarget } from './homework-target.entity';
export declare enum HomeworkType {
    QUIZ = "quiz",
    ESSAY = "essay"
}
export declare enum HomeworkTargetScope {
    CLASS = "class",
    STUDENTS = "students"
}
export declare class Homework {
    id: string;
    title: string;
    description: string;
    type: HomeworkType;
    dueAt: Date;
    class: Class;
    classId: string;
    teacher: User;
    teacherId: string;
    targetScope: HomeworkTargetScope;
    quiz: unknown;
    targets: HomeworkTarget[];
    createdAt: Date;
    updatedAt: Date;
}
