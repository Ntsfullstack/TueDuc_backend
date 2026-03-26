import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';
export declare class CoursesService {
    private readonly courseRepository;
    private readonly classRepository;
    private readonly userRepository;
    constructor(courseRepository: Repository<Course>, classRepository: Repository<Class>, userRepository: Repository<User>);
    create(actor: CurrentUserData, dto: CreateCourseDto): Promise<Course>;
    findAll(actor: CurrentUserData): Promise<Course[]>;
    findById(actor: CurrentUserData, id: string): Promise<Course>;
    update(actor: CurrentUserData, id: string, dto: UpdateCourseDto): Promise<Course>;
}
