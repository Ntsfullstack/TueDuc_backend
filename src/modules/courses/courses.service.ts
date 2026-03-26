import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { Class } from '../classes/entities/class.entity';
import { User } from '../users/entities/user.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(actor: CurrentUserData, dto: CreateCourseDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: dto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }

    if (dto.teacherId) {
      const teacher = await this.userRepository.findOne({
        where: { id: dto.teacherId },
      });
      if (!teacher || teacher.role !== Role.TEACHER) {
        throw new ForbiddenException('teacherId is not a teacher');
      }
    }

    const course = this.courseRepository.create({
      name: dto.name,
      code: dto.code,
      description: dto.description,
      classId: dto.classId,
      teacherId: dto.teacherId,
    });

    return this.courseRepository.save(course);
  }

  async findAll(actor: CurrentUserData) {
    if (actor.role === Role.ADMIN) {
      return this.courseRepository.find({ relations: ['class', 'teacher'] });
    }

    if (actor.role === Role.TEACHER) {
      return this.courseRepository.find({
        where: { teacherId: actor.userId },
        relations: ['class'],
      });
    }

    throw new ForbiddenException();
  }

  async findById(actor: CurrentUserData, id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['class', 'teacher'],
    });
    if (!course) {
      throw new NotFoundException();
    }

    if (actor.role === Role.ADMIN) {
      return course;
    }

    if (actor.role === Role.TEACHER) {
      if (course.teacherId !== actor.userId) {
        throw new ForbiddenException();
      }
      return course;
    }

    throw new ForbiddenException();
  }

  async update(actor: CurrentUserData, id: string, dto: UpdateCourseDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const course = await this.courseRepository.findOne({ where: { id } });
    if (!course) {
      throw new NotFoundException();
    }

    if (dto.classId) {
      const classEntity = await this.classRepository.findOne({
        where: { id: dto.classId },
      });
      if (!classEntity) {
        throw new NotFoundException('class not found');
      }
    }

    if (dto.teacherId) {
      const teacher = await this.userRepository.findOne({
        where: { id: dto.teacherId },
      });
      if (!teacher || teacher.role !== Role.TEACHER) {
        throw new ForbiddenException('teacherId is not a teacher');
      }
    }

    await this.courseRepository.update(id, {
      name: dto.name ?? course.name,
      code: dto.code ?? course.code,
      description: dto.description ?? course.description,
      classId: dto.classId ?? course.classId,
      teacherId: dto.teacherId ?? course.teacherId,
    });

    return this.findById(actor, id);
  }
}
