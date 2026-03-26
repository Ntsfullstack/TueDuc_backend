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
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { ClassSchedule } from './entities/class-schedule.entity';

@Injectable()
export class SchedulesService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async createClassSchedule(
    actor: CurrentUserData,
    dto: CreateClassScheduleDto,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: dto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }
    const shift = await this.shiftRepository.findOne({
      where: { id: dto.shiftId },
    });
    if (!shift) {
      throw new NotFoundException('shift not found');
    }
    const teacher = await this.userRepository.findOne({
      where: { id: dto.teacherId },
    });
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException('teacher not found');
    }

    const conflict = await this.scheduleRepository.findOne({
      where: {
        teacherId: dto.teacherId,
        weekday: dto.weekday,
        shiftId: dto.shiftId,
      },
      relations: ['class', 'shift', 'teacher'],
    });
    if (conflict && conflict.classId !== dto.classId) {
      throw new ForbiddenException('teacher schedule conflict');
    }

    const created = await this.scheduleRepository.save(
      this.scheduleRepository.create(dto),
    );
    return this.scheduleRepository.findOne({
      where: { id: created.id },
      relations: ['class', 'shift', 'teacher'],
    });
  }

  async listByClass(actor: CurrentUserData, classId: string) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }

    if (
      actor.role === Role.TEACHER &&
      classEntity.homeroomTeacherId !== actor.userId
    ) {
      throw new ForbiddenException();
    }
    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    return this.scheduleRepository.find({
      where: { classId },
      relations: ['class', 'shift', 'teacher'],
    });
  }

  private weekdayFromDate(date: string) {
    const d = new Date(date);
    return d.getDay();
  }

  async getStudentScheduleByDate(
    actor: CurrentUserData,
    studentId: string,
    date: string,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }

    if (actor.role === Role.PARENT && student.parentId !== actor.userId) {
      throw new ForbiddenException();
    }

    if (actor.role === Role.TEACHER) {
      const classEntity = await this.classRepository.findOne({
        where: { id: student.classId },
      });
      if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
        throw new ForbiddenException();
      }
    }

    const weekday = this.weekdayFromDate(date);
    return this.scheduleRepository.find({
      where: { classId: student.classId, weekday },
      relations: ['class', 'shift', 'teacher'],
    });
  }

  async getTeacherScheduleByDate(actor: CurrentUserData, date: string) {
    if (actor.role !== Role.TEACHER && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const weekday = this.weekdayFromDate(date);
    const teacherId = actor.userId;
    return this.scheduleRepository.find({
      where: { teacherId, weekday },
      relations: ['class', 'shift', 'teacher'],
    });
  }

  async getTeacherScheduleByDateForTeacher(
    actor: CurrentUserData,
    teacherId: string,
    date: string,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException('teacher not found');
    }
    const weekday = this.weekdayFromDate(date);
    return this.scheduleRepository.find({
      where: { teacherId, weekday },
      relations: ['class', 'shift', 'teacher'],
    });
  }

  private parseStartDate(start: string) {
    const d = new Date(start);
    if (Number.isNaN(d.getTime())) {
      throw new NotFoundException('invalid start date');
    }
    return d;
  }

  async getCenterScheduleWeek(actor: CurrentUserData, start: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    this.parseStartDate(start);
    const items = await this.scheduleRepository.find({
      relations: ['class', 'shift', 'teacher'],
    });
    return { start, items };
  }
}
