import { User } from '../../users/entities/user.entity';
import { Class } from '../../classes/entities/class.entity';
export declare enum StudentStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    STOPPED = "stopped"
}
export declare class Student {
    id: string;
    name: string;
    dateOfBirth: Date;
    gender: string;
    status: StudentStatus;
    studentCode: string;
    parent: User;
    parentId: string;
    class: Class;
    classId: string;
    createdAt: Date;
    updatedAt: Date;
}
