import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { SetActiveStudentDto } from './dto/set-active-student.dto';
import { SetUserActiveDto } from './dto/set-user-active.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    me(user: CurrentUserData): Promise<import("./entities/user.entity").User>;
    myChildren(actor: CurrentUserData): Promise<import("../students/entities/student.entity").Student[]>;
    activeChild(actor: CurrentUserData): Promise<{
        activeStudentId: null;
        children: import("../students/entities/student.entity").Student[];
        activeChild?: undefined;
    } | {
        activeStudentId: string;
        activeChild: import("../students/entities/student.entity").Student;
        children: import("../students/entities/student.entity").Student[];
    }>;
    setActiveChild(actor: CurrentUserData, dto: SetActiveStudentDto): Promise<{
        activeStudentId: null;
        children: import("../students/entities/student.entity").Student[];
        activeChild?: undefined;
    } | {
        activeStudentId: string;
        activeChild: import("../students/entities/student.entity").Student;
        children: import("../students/entities/student.entity").Student[];
    }>;
    findAll(): Promise<import("./entities/user.entity").User[]>;
    listTeachers(): Promise<import("./entities/user.entity").User[]>;
    listParents(): Promise<import("./entities/user.entity").User[]>;
    setActive(id: string, dto: SetUserActiveDto): Promise<import("./entities/user.entity").User | null>;
    resetPassword(id: string, dto: ResetPasswordDto): Promise<{
        updated: boolean;
    }>;
    findById(id: string): Promise<import("./entities/user.entity").User>;
}
