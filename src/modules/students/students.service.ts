import {
  BadRequestException,
  ConflictException,
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
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private generateStudentCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const rand = Array.from({ length: 6 }, () =>
      chars[Math.floor(Math.random() * chars.length)],
    ).join('');
    return `HS-${rand}`;
  }

  async create(actor: CurrentUserData, dto: CreateStudentDto) {
    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    if (dto.classId && actor.role === Role.TEACHER) {
      const classEntity = await this.classRepository.findOne({
        where: { id: dto.classId },
      });
      if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
        throw new ForbiddenException();
      }
    }

    if (dto.parentId) {
      const parent = await this.userRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent || parent.role !== Role.PARENT) {
        throw new ForbiddenException('parentId is not a parent');
      }
    }

    // Generate a unique student code (retry on collision)
    let studentCode: string;
    let attempts = 0;
    do {
      studentCode = this.generateStudentCode();
      const existing = await this.studentRepository.findOne({
        where: { studentCode },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < 5);

    const student = this.studentRepository.create({
      name: dto.name,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      parentId: dto.parentId,
      classId: dto.classId,
      studentCode,
    });

    return this.studentRepository.save(student);
  }

  async findMyChildren(actor: CurrentUserData) {
    if (actor.role !== Role.PARENT) {
      throw new ForbiddenException();
    }

    return this.studentRepository.find({
      where: { parentId: actor.userId },
      relations: ['class'],
    });
  }

  async findAll(actor: CurrentUserData) {
    if (actor.role === Role.ADMIN) {
      return this.studentRepository.find({ relations: ['class', 'parent'] });
    }

    if (actor.role === Role.TEACHER) {
      const myClasses = await this.classRepository.find({
        where: { homeroomTeacherId: actor.userId },
      });
      const classIds = myClasses.map((c) => c.id);
      if (classIds.length === 0) {
        return [];
      }
      return this.studentRepository
        .createQueryBuilder('student')
        .leftJoinAndSelect('student.class', 'class')
        .leftJoinAndSelect('student.parent', 'parent')
        .where('student.classId IN (:...classIds)', { classIds })
        .getMany();
    }

    throw new ForbiddenException();
  }

  async findById(actor: CurrentUserData, id: string) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['class', 'parent'],
    });
    if (!student) {
      throw new NotFoundException();
    }

    if (actor.role === Role.ADMIN) {
      return student;
    }

    if (actor.role === Role.PARENT) {
      if (student.parentId !== actor.userId) {
        throw new ForbiddenException();
      }
      return student;
    }

    if (actor.role === Role.TEACHER) {
      if (student.class?.homeroomTeacherId !== actor.userId) {
        throw new ForbiddenException();
      }
      return student;
    }

    throw new ForbiddenException();
  }

  async update(actor: CurrentUserData, id: string, dto: UpdateStudentDto) {
    const student = await this.findById(actor, id);

    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    if (dto.classId && actor.role === Role.TEACHER) {
      const classEntity = await this.classRepository.findOne({
        where: { id: dto.classId },
      });
      if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
        throw new ForbiddenException();
      }
    }

    if (dto.parentId) {
      const parent = await this.userRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent || parent.role !== Role.PARENT) {
        throw new ForbiddenException('parentId is not a parent');
      }
    }

    const patch: Partial<Student> = {
      name: dto.name ?? student.name,
      dateOfBirth: dto.dateOfBirth
        ? new Date(dto.dateOfBirth)
        : student.dateOfBirth,
      gender: dto.gender ?? student.gender,
      parentId: dto.parentId ?? student.parentId,
      classId: dto.classId ?? student.classId,
      status: dto.status ?? student.status,
    };

    await this.studentRepository.update(id, patch);
    return this.findById(actor, id);
  }

  async transfer(actor: CurrentUserData, id: string, classId: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException();
    }
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }
    await this.studentRepository.update(id, { classId });
    return this.studentRepository.findOne({
      where: { id },
      relations: ['class', 'parent'],
    });
  }

  async remove(actor: CurrentUserData, id: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const student = await this.studentRepository.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException();
    }
    await this.studentRepository.delete(id);
    return { deleted: true };
  }

  async linkParent(
    actor: CurrentUserData,
    studentId: string,
    parentId: string,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const parent = await this.userRepository.findOne({
      where: { id: parentId },
    });
    if (!parent) {
      throw new NotFoundException('Parent user not found');
    }
    if (parent.role !== Role.PARENT) {
      throw new BadRequestException(
        'The specified user does not have the parent role',
      );
    }

    await this.studentRepository.update(studentId, { parentId });
    return this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['class', 'parent'],
    });
  }

  async unlinkParent(actor: CurrentUserData, studentId: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ parentId: () => 'NULL' })
      .where('id = :id', { id: studentId })
      .execute();
    return this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['class', 'parent'],
    });
  }

  async claimStudent(actor: CurrentUserData, studentCode: string) {
    if (actor.role !== Role.PARENT) {
      throw new ForbiddenException();
    }

    const student = await this.studentRepository.findOne({
      where: { studentCode },
      relations: ['class', 'parent'],
    });
    if (!student) {
      throw new NotFoundException('Mã học sinh không tồn tại');
    }

    // Idempotent: already linked to this parent
    if (student.parentId === actor.userId) {
      return student;
    }

    // Already claimed by another parent
    if (student.parentId) {
      throw new ConflictException(
        'Mã học sinh này đã được liên kết với một tài khoản phụ huynh khác',
      );
    }

    await this.studentRepository.update(student.id, { parentId: actor.userId });
    return this.studentRepository.findOne({
      where: { id: student.id },
      relations: ['class', 'parent'],
    });
  }

  async regenerateCode(actor: CurrentUserData, studentId: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    let studentCode: string;
    let attempts = 0;
    do {
      studentCode = this.generateStudentCode();
      const existing = await this.studentRepository.findOne({
        where: { studentCode },
      });
      if (!existing) break;
      attempts++;
    } while (attempts < 5);

    await this.studentRepository.update(studentId, { studentCode });
    return this.studentRepository.findOne({
      where: { id: studentId },
      relations: ['class', 'parent'],
    });
  }
}
