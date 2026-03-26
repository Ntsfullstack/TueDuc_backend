import { Class } from '../../classes/entities/class.entity';
import { User } from '../../users/entities/user.entity';
export declare class Course {
    id: string;
    name: string;
    code: string;
    description: string;
    class: Class;
    classId: string;
    teacher: User;
    teacherId: string;
    createdAt: Date;
    updatedAt: Date;
}
