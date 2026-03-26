import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateStudentDto } from './dto/create-student.dto';
import { ClaimStudentDto } from './dto/claim-student.dto';
import { LinkParentDto } from './dto/link-parent.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';
declare class TransferStudentDto {
    classId: string;
}
export declare class StudentsController {
    private readonly studentsService;
    constructor(studentsService: StudentsService);
    my(actor: CurrentUserData): Promise<import("./entities/student.entity").Student[]>;
    findAll(actor: CurrentUserData): Promise<import("./entities/student.entity").Student[]>;
    findById(actor: CurrentUserData, id: string): Promise<import("./entities/student.entity").Student>;
    create(actor: CurrentUserData, dto: CreateStudentDto): Promise<import("./entities/student.entity").Student>;
    update(actor: CurrentUserData, id: string, dto: UpdateStudentDto): Promise<import("./entities/student.entity").Student>;
    transfer(actor: CurrentUserData, id: string, dto: TransferStudentDto): Promise<import("./entities/student.entity").Student | null>;
    remove(actor: CurrentUserData, id: string): Promise<{
        deleted: boolean;
    }>;
    linkParent(actor: CurrentUserData, id: string, dto: LinkParentDto): Promise<import("./entities/student.entity").Student | null>;
    unlinkParent(actor: CurrentUserData, id: string): Promise<import("./entities/student.entity").Student | null>;
    claim(actor: CurrentUserData, dto: ClaimStudentDto): Promise<import("./entities/student.entity").Student | null>;
    regenerateCode(actor: CurrentUserData, id: string): Promise<import("./entities/student.entity").Student | null>;
}
export {};
