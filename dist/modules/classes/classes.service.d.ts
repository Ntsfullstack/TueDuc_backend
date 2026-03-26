import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassStatus } from './entities/class.entity';
export declare class ClassesService {
    private readonly classRepository;
    private readonly userRepository;
    constructor(classRepository: Repository<Class>, userRepository: Repository<User>);
    create(actor: CurrentUserData, dto: CreateClassDto): Promise<Class>;
    findAll(actor: CurrentUserData): Promise<Class[]>;
    findById(actor: CurrentUserData, id: string): Promise<Class>;
    update(actor: CurrentUserData, id: string, dto: UpdateClassDto): Promise<Class | null>;
    remove(actor: CurrentUserData, id: string): Promise<{
        deleted: boolean;
    }>;
    archive(actor: CurrentUserData, id: string): Promise<Class | null>;
    setStatus(actor: CurrentUserData, id: string, status: ClassStatus): Promise<Class | null>;
    clone(actor: CurrentUserData, id: string): Promise<Class | null>;
}
