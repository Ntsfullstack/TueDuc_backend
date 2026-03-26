import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import { Role } from '../../common/enums/role.enum';
export declare class UsersService {
    private readonly userRepository;
    private readonly studentRepository;
    constructor(userRepository: Repository<User>, studentRepository: Repository<Student>);
    create(userData: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User>;
    findAll(): Promise<User[]>;
    listByRole(role: Role): Promise<User[]>;
    setActive(id: string, isActive: boolean): Promise<User | null>;
    resetPassword(id: string, newPassword: string): Promise<{
        updated: boolean;
    }>;
    listMyChildren(parentId: string): Promise<Student[]>;
    getActiveChild(parentId: string): Promise<{
        activeStudentId: null;
        children: Student[];
        activeChild?: undefined;
    } | {
        activeStudentId: string;
        activeChild: Student;
        children: Student[];
    }>;
    setActiveChild(parentId: string, studentId: string): Promise<{
        activeStudentId: null;
        children: Student[];
        activeChild?: undefined;
    } | {
        activeStudentId: string;
        activeChild: Student;
        children: Student[];
    }>;
    remove(id: string): Promise<void>;
}
