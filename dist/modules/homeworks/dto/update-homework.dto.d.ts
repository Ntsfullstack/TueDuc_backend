import { HomeworkType } from '../entities/homework.entity';
export declare class UpdateHomeworkDto {
    title?: string;
    description?: string;
    type?: HomeworkType;
    dueAt?: string;
}
