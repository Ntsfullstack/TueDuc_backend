import { StudentStatus } from '../entities/student.entity';
export declare class UpdateStudentDto {
    name?: string;
    dateOfBirth?: string;
    gender?: string;
    parentId?: string;
    classId?: string;
    status?: StudentStatus;
}
