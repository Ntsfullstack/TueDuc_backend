import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesService } from './courses.service';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(actor: CurrentUserData): Promise<import("./entities/course.entity").Course[]>;
    findById(actor: CurrentUserData, id: string): Promise<import("./entities/course.entity").Course>;
    create(actor: CurrentUserData, dto: CreateCourseDto): Promise<import("./entities/course.entity").Course>;
    update(actor: CurrentUserData, id: string, dto: UpdateCourseDto): Promise<import("./entities/course.entity").Course>;
}
