import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { Role } from '../../common/enums/role.enum';
import { User } from '../users/entities/user.entity';
import { CreateClassDto } from './dto/create-class.dto';
import { ListClassQueryDto } from './dto/list-class-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Class, ClassStatus } from './entities/class.entity';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(actor: CurrentUserData, dto: CreateClassDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = this.classRepository.create({
      name: dto.name,
      grade: dto.grade,
      academicYear: dto.academicYear,
      maxStudents: dto.maxStudents ?? null,
    });

    return this.classRepository.save(classEntity);
  }

  async findAll(
    actor: CurrentUserData,
    query: ListClassQueryDto,
  ): Promise<PaginatedResponse<Class>> {
    const { page = 1, limit = 20, search, status, grade, academicYear } = query;

    const qb = this.classRepository
      .createQueryBuilder('class')
      .loadRelationCountAndMap('class.studentCount', 'class.students');

    // Role-based access
    if (actor.role === Role.TEACHER) {
      qb.andWhere(
        '(class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :teacherId) OR ' +
          'class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :teacherId))',
        { teacherId: actor.userId },
      );
    } else if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    // Filters
    if (search) {
      qb.andWhere('class.name ILIKE :search', { search: `%${search}%` });
    }
    if (status) {
      qb.andWhere('class.status = :status', { status });
    }
    if (grade) {
      qb.andWhere('class.grade = :grade', { grade });
    }
    if (academicYear) {
      qb.andWhere('class.academicYear = :academicYear', { academicYear });
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('class.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponse(data, total, page, limit);
  }

  async findById(actor: CurrentUserData, id: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['students', 'schedules', 'schedules.shift'],
    });
    if (!classEntity) {
      throw new NotFoundException();
    }

    if (actor.role === Role.ADMIN) {
      return classEntity;
    }

    if (actor.role === Role.TEACHER) {
      const hasAccess = await this.classRepository
        .createQueryBuilder('class')
        .where('class.id = :classId', { classId: id })
        .andWhere(
          '(class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :teacherId) OR ' +
            'class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :teacherId))',
          { teacherId: actor.userId },
        )
        .getExists();

      if (!hasAccess) {
        throw new ForbiddenException();
      }
      return classEntity;
    }

    throw new ForbiddenException();
  }

  async update(actor: CurrentUserData, id: string, dto: UpdateClassDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException();
    }

    await this.classRepository.update(id, {
      name: dto.name ?? classEntity.name,
      grade: dto.grade ?? classEntity.grade,
      academicYear: dto.academicYear ?? classEntity.academicYear,
      status: dto.status ?? classEntity.status,
      maxStudents: dto.maxStudents ?? classEntity.maxStudents,
    });

    return this.classRepository.findOne({
      where: { id },
      relations: ['students', 'schedules', 'schedules.shift'],
    });
  }

  async remove(actor: CurrentUserData, id: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException();
    }
    await this.classRepository.delete(id);
    return { deleted: true };
  }

  async archive(actor: CurrentUserData, id: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException();
    }
    await this.classRepository.update(id, {
      archivedAt: new Date(),
      status: ClassStatus.CLOSED,
    });
    return this.classRepository.findOne({
      where: { id },
      relations: ['students', 'schedules', 'schedules.shift'],
    });
  }

  async setStatus(actor: CurrentUserData, id: string, status: ClassStatus) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException();
    }
    await this.classRepository.update(id, { status });
    return this.classRepository.findOne({
      where: { id },
      relations: ['students', 'schedules', 'schedules.shift'],
    });
  }

  async clone(actor: CurrentUserData, id: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const source = await this.classRepository.findOne({ where: { id } });
    if (!source) {
      throw new NotFoundException();
    }
    const cloned = await this.classRepository.save(
      this.classRepository.create({
        name: `${source.name} (Clone)`,
        grade: source.grade,
        academicYear: source.academicYear,
        status: source.status,
        maxStudents: source.maxStudents,
        archivedAt: null,
        clonedFromId: source.id,
      }),
    );
    return this.classRepository.findOne({
      where: { id: cloned.id },
      relations: ['students', 'schedules', 'schedules.shift'],
    });
  }
}
