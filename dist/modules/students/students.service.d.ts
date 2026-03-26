import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
export declare class StudentsService {
    private readonly studentRepository;
    private readonly classRepository;
    private readonly userRepository;
    constructor(studentRepository: Repository<Student>, classRepository: Repository<Class>, userRepository: Repository<User>);
    private generateStudentCode;
    create(actor: CurrentUserData, dto: CreateStudentDto): Promise<Student>;
    findMyChildren(actor: CurrentUserData): Promise<Student[]>;
    findAll(actor: CurrentUserData): Promise<Student[]>;
    findById(actor: CurrentUserData, id: string): Promise<Student>;
    update(actor: CurrentUserData, id: string, dto: UpdateStudentDto): Promise<Student>;
    transfer(actor: CurrentUserData, id: string, classId: string): Promise<Student | null>;
    remove(actor: CurrentUserData, id: string): Promise<{
        deleted: boolean;
    }>;
    linkParent(actor: CurrentUserData, studentId: string, parentId: string): Promise<Student | null>;
    unlinkParent(actor: CurrentUserData, studentId: string): Promise<Student | null>;
    claimStudent(actor: CurrentUserData, studentCode: string): Promise<Student | null>;
    regenerateCode(actor: CurrentUserData, studentId: string): Promise<Student | null>;
}
