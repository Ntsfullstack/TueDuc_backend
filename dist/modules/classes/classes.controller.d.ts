import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassesService } from './classes.service';
import { ClassStatus } from './entities/class.entity';
declare class SetClassStatusDto {
    status: ClassStatus;
}
export declare class ClassesController {
    private readonly classesService;
    constructor(classesService: ClassesService);
    findAll(actor: CurrentUserData): Promise<import("./entities/class.entity").Class[]>;
    findById(actor: CurrentUserData, id: string): Promise<import("./entities/class.entity").Class>;
    create(actor: CurrentUserData, dto: CreateClassDto): Promise<import("./entities/class.entity").Class>;
    update(actor: CurrentUserData, id: string, dto: UpdateClassDto): Promise<import("./entities/class.entity").Class | null>;
    remove(actor: CurrentUserData, id: string): Promise<{
        deleted: boolean;
    }>;
    clone(actor: CurrentUserData, id: string): Promise<import("./entities/class.entity").Class | null>;
    archive(actor: CurrentUserData, id: string): Promise<import("./entities/class.entity").Class | null>;
    setStatus(actor: CurrentUserData, id: string, dto: SetClassStatusDto): Promise<import("./entities/class.entity").Class | null>;
}
export {};
