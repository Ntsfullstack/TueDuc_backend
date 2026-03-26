import { ClassStatus } from '../entities/class.entity';
export declare class UpdateClassDto {
    name?: string;
    grade?: string;
    academicYear?: string;
    homeroomTeacherId?: string;
    status?: ClassStatus;
    maxStudents?: number;
}
