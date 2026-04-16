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
import {
  AttendanceRecord,
  AttendanceStatus,
} from './entities/attendance-record.entity';
import { AttendanceSession } from './entities/attendance-session.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { AttendanceEditLog } from './entities/attendance-edit-log.entity';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(AttendanceSession)
    private readonly sessionRepository: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private readonly recordRepository: Repository<AttendanceRecord>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(AttendanceEditLog)
    private readonly editLogRepository: Repository<AttendanceEditLog>,
  ) {}

  async mark(actor: CurrentUserData, dto: MarkAttendanceDto) {
    if (actor.role !== Role.TEACHER && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: dto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }

    if (actor.role === Role.TEACHER) {
      const hasAccess = await this.classRepository
        .createQueryBuilder('class')
        .where('class.id = :classId', { classId: dto.classId })
        .andWhere(
          '(class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :teacherId) OR ' +
            'class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :teacherId))',
          { teacherId: actor.userId },
        )
        .getExists();
      if (!hasAccess) {
        throw new ForbiddenException();
      }
    }

    let session = await this.sessionRepository.findOne({
      where: { classId: dto.classId, date: dto.date, shiftId: dto.shiftId },
    });
    if (!session) {
      session = await this.sessionRepository.save(
        this.sessionRepository.create({
          classId: dto.classId,
          date: dto.date,
          shiftId: dto.shiftId,
          teacherId: actor.userId,
        }),
      );
    }

    const studentIds = dto.records.map((r) => r.studentId);
    const students = await this.studentRepository
      .createQueryBuilder('student')
      .where('student.id IN (:...ids)', { ids: studentIds })
      .getMany();

    const studentById = new Map(students.map((s) => [s.id, s]));
    for (const r of dto.records) {
      const student = studentById.get(r.studentId);
      if (!student) {
        throw new NotFoundException(`student not found: ${r.studentId}`);
      }
      if (student.classId !== dto.classId) {
        throw new ForbiddenException(`student not in class: ${r.studentId}`);
      }
    }

    for (const r of dto.records) {
      const existing = await this.recordRepository.findOne({
        where: { sessionId: session.id, studentId: r.studentId },
      });
      if (!existing) {
        await this.recordRepository.save(
          this.recordRepository.create({
            sessionId: session.id,
            studentId: r.studentId,
            status: r.status || AttendanceStatus.PRESENT,
            note: r.note,
          }),
        );
      } else {
        await this.recordRepository.update(existing.id, {
          status: r.status,
          note: r.note,
        });
      }
    }

    return this.sessionRepository.findOne({
      where: { id: session.id },
      relations: ['class', 'shift', 'records', 'records.student'],
    });
  }

  async getByClassDate(
    actor: CurrentUserData,
    classId: string,
    date: string,
    shiftId: string,
  ) {
    const classEntity = await this.classRepository.findOne({
      where: { id: classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }

    if (actor.role === Role.TEACHER) {
      const hasAccess = await this.classRepository
        .createQueryBuilder('class')
        .where('class.id = :classId', { classId })
        .andWhere(
          '(class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :teacherId) OR ' +
            'class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :teacherId))',
          { teacherId: actor.userId },
        )
        .getExists();
      if (!hasAccess) {
        throw new ForbiddenException();
      }
    }

    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    const session = await this.sessionRepository.findOne({
      where: { classId, date, shiftId },
      relations: ['class', 'shift', 'records', 'records.student'],
    });

    return session;
  }

  async getByStudent(actor: CurrentUserData, studentId: string) {
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
      const hasAccess = await this.classRepository
        .createQueryBuilder('class')
        .where('class.id = :classId', { classId: student.classId })
        .andWhere(
          '(class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :teacherId) OR ' +
            'class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :teacherId))',
          { teacherId: actor.userId },
        )
        .getExists();
      if (!hasAccess) {
        throw new ForbiddenException();
      }
    }

    return this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.session', 'session')
      .leftJoinAndSelect('session.shift', 'shift')
      .where('record.studentId = :studentId', { studentId })
      .orderBy('session.date', 'DESC')
      .getMany();
  }

  async adminListSessions(
    actor: CurrentUserData,
    date: string,
    shiftId: string,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    return this.sessionRepository.find({
      where: { date, shiftId },
      relations: ['class', 'shift', 'records', 'records.student'],
    });
  }

  async adminUpdateSession(
    actor: CurrentUserData,
    sessionId: string,
    dto: UpdateAttendanceDto,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const session = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['class', 'shift', 'records', 'records.student'],
    });
    if (!session) {
      throw new NotFoundException('session not found');
    }

    const before = (session.records || []).map((r) => ({
      studentId: r.studentId,
      status: r.status,
      note: r.note ?? null,
    }));

    for (const patch of dto.records) {
      const existing = await this.recordRepository.findOne({
        where: { sessionId, studentId: patch.studentId },
      });
      if (!existing) {
        await this.recordRepository.save(
          this.recordRepository.create({
            sessionId,
            studentId: patch.studentId,
            status: patch.status,
            note: patch.note,
          }),
        );
      } else {
        await this.recordRepository.update(existing.id, {
          status: patch.status,
          note: patch.note,
        });
      }
    }

    const updated = await this.sessionRepository.findOne({
      where: { id: sessionId },
      relations: ['class', 'shift', 'records', 'records.student'],
    });
    if (!updated) {
      throw new NotFoundException('session not found');
    }

    const after = (updated.records || []).map((r) => ({
      studentId: r.studentId,
      status: r.status,
      note: r.note ?? null,
    }));

    await this.editLogRepository.save(
      this.editLogRepository.create({
        sessionId,
        editorId: actor.userId,
        reason: dto.reason ?? null,
        before,
        after,
      }),
    );

    return updated;
  }

  async adminEditLogs(actor: CurrentUserData, sessionId: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    return this.editLogRepository.find({
      where: { sessionId },
      order: { createdAt: 'DESC' },
    });
  }
}
