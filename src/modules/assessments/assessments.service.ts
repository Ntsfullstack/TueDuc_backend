import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { Course } from '../courses/entities/course.entity';
import { Student } from '../students/entities/student.entity';
import { Assessment } from './entities/assessment.entity';

@Injectable()
export class AssessmentsService {
  constructor(
    @InjectRepository(Assessment)
    private readonly assessmentRepository: Repository<Assessment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

  async create(
    actor: CurrentUserData,
    assessmentData: Partial<Assessment>,
  ): Promise<Assessment> {
    if (actor.role !== Role.TEACHER && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const course = await this.courseRepository.findOne({
      where: { id: assessmentData.courseId },
    });
    if (!course) {
      throw new NotFoundException('course not found');
    }

    const student = await this.studentRepository.findOne({
      where: { id: assessmentData.studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }

    if (actor.role === Role.TEACHER) {
      if (course.teacherId !== actor.userId) {
        throw new ForbiddenException();
      }
      if (
        student.classId &&
        course.classId &&
        student.classId !== course.classId
      ) {
        throw new ForbiddenException('student is not in course class');
      }
      assessmentData.teacherId = actor.userId;
    }

    const assessment = this.assessmentRepository.create(assessmentData);
    return this.assessmentRepository.save(assessment);
  }

  async findAllByStudent(
    actor: CurrentUserData,
    studentId: string,
  ): Promise<Assessment[]> {
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
      const items = await this.assessmentRepository.find({
        where: { studentId },
        relations: ['course', 'teacher'],
      });
      return items.filter((a) => a.teacherId === actor.userId);
    }

    if (actor.role === Role.ADMIN || actor.role === Role.PARENT) {
      return this.assessmentRepository.find({
        where: { studentId },
        relations: ['course', 'teacher'],
      });
    }

    throw new ForbiddenException();
  }

  async findById(actor: CurrentUserData, id: string): Promise<Assessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['student', 'course', 'teacher'],
    });
    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    if (actor.role === Role.ADMIN) {
      return assessment;
    }

    if (actor.role === Role.TEACHER) {
      if (assessment.teacherId !== actor.userId) {
        throw new ForbiddenException();
      }
      return assessment;
    }

    if (actor.role === Role.PARENT) {
      if (assessment.student?.parentId !== actor.userId) {
        throw new ForbiddenException();
      }
      return assessment;
    }

    throw new ForbiddenException();
  }
  async update(
    actor: CurrentUserData,
    id: string,
    updateData: Partial<Assessment>,
  ): Promise<Assessment> {
    const existing = await this.findById(actor, id);

    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    if (actor.role === Role.TEACHER && existing.teacherId !== actor.userId) {
      throw new ForbiddenException();
    }

    await this.assessmentRepository.update(id, updateData);
    return this.findById(actor, id);
  }
  async getThreeRootsSummary(actor: CurrentUserData, studentId: string) {
    const assessments = await this.findAllByStudent(actor, studentId);

    if (assessments.length === 0) return null;

    const total = assessments.length;
    const summary = assessments.reduce(
      (acc, curr) => ({
        ethics: acc.ethics + Number(curr.ethicsScore || 0),
        wisdom: acc.wisdom + Number(curr.wisdomScore || 0),
        willpower: acc.willpower + Number(curr.willpowerScore || 0),
      }),
      { ethics: 0, wisdom: 0, willpower: 0 },
    );

    return {
      avgEthics: summary.ethics / total,
      avgWisdom: summary.wisdom / total,
      avgWillpower: summary.willpower / total,
      totalAssessments: total,
    };
  }
}
