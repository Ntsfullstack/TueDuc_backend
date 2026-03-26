import { Role } from '../../../common/enums/role.enum';
export declare class User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
    isActive: boolean;
    activeStudentId: string | null;
    createdAt: Date;
    updatedAt: Date;
}
