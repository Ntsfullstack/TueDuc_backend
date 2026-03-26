import { User } from '../../users/entities/user.entity';
import { Student } from '../../students/entities/student.entity';
export declare enum ClassStatus {
    OPEN = "open",
    CLOSED = "closed",
    PAUSED = "paused"
}
export declare class Class {
    id: string;
    name: string;
    grade: string;
    academicYear: string;
    status: ClassStatus;
    maxStudents: number | null;
    archivedAt: Date | null;
    clonedFromId: string | null;
    homeroomTeacher: User;
    homeroomTeacherId: string;
    students: Student[];
    createdAt: Date;
    updatedAt: Date;
}
