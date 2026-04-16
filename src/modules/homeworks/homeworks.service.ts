import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { Role } from '../../common/enums/role.enum';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { ListHomeworkQueryDto } from './dto/list-homework-query.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import {
  Homework,
  HomeworkTargetScope,
  HomeworkType,
} from './entities/homework.entity';
import {
  HomeworkSubmission,
  HomeworkSubmissionStatus,
} from './entities/homework-submission.entity';
import { HomeworkTarget } from './entities/homework-target.entity';

@Injectable()
export class HomeworksService {
  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private getQuizQuestions(
    quiz: unknown,
  ): Array<{ prompt: string; options: string[]; correctIndex?: number }> {
    if (!this.isRecord(quiz)) {
      return [];
    }
    const questions = quiz['questions'];
    if (!Array.isArray(questions)) {
      return [];
    }
    return questions
      .filter((q) => this.isRecord(q))
      .map((q) => ({
        prompt: typeof q['prompt'] === 'string' ? q['prompt'] : '',
        options: Array.isArray(q['options'])
          ? q['options'].filter((o) => typeof o === 'string')
          : [],
        correctIndex:
          typeof q['correctIndex'] === 'number' ? q['correctIndex'] : undefined,
      }))
      .filter((q) => q.prompt.length > 0);
  }

  constructor(
    @InjectRepository(Homework)
    private readonly homeworkRepository: Repository<Homework>,
    @InjectRepository(HomeworkTarget)
    private readonly targetRepository: Repository<HomeworkTarget>,
    @InjectRepository(HomeworkSubmission)
    private readonly submissionRepository: Repository<HomeworkSubmission>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private stripQuizAnswersIfNeeded(actor: CurrentUserData, homework: Homework) {
    if (homework.type !== HomeworkType.QUIZ) {
      return homework;
    }
    if (!homework.quiz) {
      return homework;
    }
    if (actor.role === Role.TEACHER || actor.role === Role.ADMIN) {
      return homework;
    }
    const questions = this.getQuizQuestions(homework.quiz);
    const safeQuestions = questions.map((q) => ({
      prompt: q.prompt,
      options: q.options,
    }));
    return {
      ...homework,
      quiz: {
        questions: safeQuestions,
      },
    } as Homework;
  }

  async create(actor: CurrentUserData, dto: CreateHomeworkDto) {
    if (actor.role !== Role.TEACHER && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const classEntity = await this.classRepository.findOne({
      where: { id: dto.classId },
    });
    if (!classEntity) {
      throw new NotFoundException('class not found');
    }

    let teacherId = actor.userId;
    if (actor.role === Role.ADMIN) {
      teacherId = dto.teacherId || actor.userId;
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

      teacherId = dto.teacherId || actor.userId;
    }

    const homework = await this.homeworkRepository.save(
      this.homeworkRepository.create({
        title: dto.title,
        description: dto.description,
        type: dto.type,
        dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
        classId: dto.classId,
        teacherId,
        targetScope: dto.targetScope,
        quiz:
          dto.type === HomeworkType.QUIZ
            ? {
                questions: (dto.quizQuestions || []).map((q) => ({
                  prompt: q.prompt,
                  options: q.options,
                  correctIndex: q.correctIndex,
                })),
              }
            : null,
      }),
    );

    if (dto.targetScope === HomeworkTargetScope.STUDENTS) {
      const ids = dto.studentIds || [];
      if (ids.length === 0) {
        throw new ForbiddenException(
          'studentIds required for targetScope=students',
        );
      }

      const students = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.id IN (:...ids)', { ids })
        .getMany();

      const studentById = new Map(students.map((s) => [s.id, s]));
      for (const id of ids) {
        const s = studentById.get(id);
        if (!s) {
          throw new NotFoundException(`student not found: ${id}`);
        }
        if (s.classId !== dto.classId) {
          throw new ForbiddenException(`student not in class: ${id}`);
        }
      }

      await this.targetRepository.save(
        ids.map((studentId) =>
          this.targetRepository.create({ homeworkId: homework.id, studentId }),
        ),
      );
    }

    const created = await this.homeworkRepository.findOne({
      where: { id: homework.id },
      relations: ['class', 'teacher', 'targets', 'targets.student'],
    });
    return this.stripQuizAnswersIfNeeded(actor, created as Homework);
  }

  async update(actor: CurrentUserData, id: string, dto: UpdateHomeworkDto) {
    const homework = await this.homeworkRepository.findOne({ where: { id } });
    if (!homework) {
      throw new NotFoundException();
    }

    if (actor.role === Role.TEACHER && homework.teacherId !== actor.userId) {
      throw new ForbiddenException();
    }
    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    await this.homeworkRepository.update(id, {
      title: dto.title ?? homework.title,
      description: dto.description ?? homework.description,
      type: dto.type ?? homework.type,
      dueAt: dto.dueAt ? new Date(dto.dueAt) : homework.dueAt,
    });

    const updated = await this.homeworkRepository.findOne({
      where: { id },
      relations: ['class', 'teacher', 'targets', 'targets.student'],
    });
    return this.stripQuizAnswersIfNeeded(actor, updated as Homework);
  }

  async findById(actor: CurrentUserData, id: string) {
    const homework = await this.homeworkRepository.findOne({
      where: { id },
      relations: ['class', 'teacher', 'targets', 'targets.student'],
    });
    if (!homework) {
      throw new NotFoundException();
    }

    if (actor.role === Role.ADMIN) {
      return this.stripQuizAnswersIfNeeded(actor, homework);
    }

    if (actor.role === Role.TEACHER) {
      if (homework.teacherId !== actor.userId) {
        throw new ForbiddenException();
      }
      return this.stripQuizAnswersIfNeeded(actor, homework);
    }

    if (actor.role === Role.PARENT) {
      const children = await this.studentRepository.find({
        where: { parentId: actor.userId },
      });
      const childIds = new Set(children.map((c) => c.id));
      const canSee = await this.isHomeworkVisibleToAnyStudent(
        homework,
        childIds,
      );
      if (!canSee) {
        throw new ForbiddenException();
      }
      return this.stripQuizAnswersIfNeeded(actor, homework);
    }

    throw new ForbiddenException();
  }

  private async isHomeworkVisibleToAnyStudent(
    homework: Homework,
    studentIds: Set<string>,
  ) {
    if (homework.targetScope === HomeworkTargetScope.CLASS) {
      const ids = Array.from(studentIds);
      if (!ids.length) {
        return false;
      }
      const count = await this.studentRepository
        .createQueryBuilder('student')
        .where('student.classId = :classId', { classId: homework.classId })
        .andWhere('student.id IN (:...ids)', { ids })
        .getCount();
      return count > 0;
    }

    const targets = await this.targetRepository.find({
      where: { homeworkId: homework.id },
    });
    return targets.some((t) => studentIds.has(t.studentId));
  }

  async list(actor: CurrentUserData, query: ListHomeworkQueryDto) {
    const { page = 1, limit = 20, search, classId, teacherId, studentId } = query;
    const qb = this.homeworkRepository.createQueryBuilder('homework')
      .leftJoinAndSelect('homework.class', 'class')
      .leftJoinAndSelect('homework.teacher', 'teacher')
      .leftJoinAndSelect('homework.targets', 'targets');

    if (search) {
      qb.andWhere('homework.title ILIKE :search', { search: `%${search}%` });
    }

    if (actor.role === Role.ADMIN) {
      if (classId) qb.andWhere('homework.classId = :classId', { classId });
      if (teacherId) qb.andWhere('homework.teacherId = :teacherId', { teacherId });
      // Teacher can see homeworks they created OR homeworks for classes they manage
      qb.andWhere(
        '(homework.teacherId = :actorId OR class.id IN (SELECT "class_id" FROM "class_schedules" WHERE "teacher_id" = :actorId) OR class.id IN (SELECT "class_id" FROM "courses" WHERE "teacher_id" = :actorId))',
        { actorId: actor.userId },
      );
      if (classId) qb.andWhere('homework.classId = :classId', { classId });
    } else if (actor.role === Role.PARENT) {
      const parentChildId = studentId; // If provided, filter by specific child
      const children = await this.studentRepository.find({
        where: { parentId: actor.userId },
      });
      const allChildIds = children.map((c) => c.id);
      const filteredChildIds = parentChildId ? [parentChildId] : allChildIds;
      
      if (filteredChildIds.length === 0) {
        return new PaginatedResponse([], 0, page, limit);
      }

      const classIds = Array.from(
        new Set(children.filter(c => filteredChildIds.includes(c.id)).map((c) => c.classId).filter(Boolean)),
      );

      qb.andWhere(
        new Brackets((innerQb) => {
          innerQb.where(
            'homework.targetScope = :scopeClass AND homework.classId IN (:...classIds)',
            { scopeClass: HomeworkTargetScope.CLASS, classIds: classIds.length ? classIds : ['00000000-0000-0000-0000-000000000000'] }
          );
          innerQb.orWhere(
            'homework.targetScope = :scopeStudents AND targets.studentId IN (:...childIds)',
            { scopeStudents: HomeworkTargetScope.STUDENTS, childIds: filteredChildIds }
          );
        })
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('homework.createdAt', 'DESC');

    const [list, totalRecords] = await qb.getManyAndCount();

    const data = await Promise.all(
      list.map(async (h) => {
        const stripped = this.stripQuizAnswersIfNeeded(actor, h);

        // Calculate total target students
        let totalStudents = 0;
        if (h.targetScope === HomeworkTargetScope.CLASS) {
          totalStudents = await this.studentRepository.count({
            where: { classId: h.classId },
          });
        } else {
          totalStudents = await this.targetRepository.count({
            where: { homeworkId: h.id },
          });
        }

        // Calculate submitted students
        const submittedCount = await this.submissionRepository.count({
          where: { homeworkId: h.id },
        });

        return {
          ...stripped,
          stats: {
            totalStudents,
            submittedCount,
          },
        };
      }),
    );

    return new PaginatedResponse(data, totalRecords, page, limit);
  }

  async submitQuiz(
    actor: CurrentUserData,
    homeworkId: string,
    dto: SubmitQuizDto,
  ) {
    if (actor.role !== Role.PARENT) {
      throw new ForbiddenException();
    }

    const homework = await this.homeworkRepository.findOne({
      where: { id: homeworkId },
      relations: ['targets'],
    });
    if (!homework) {
      throw new NotFoundException('homework not found');
    }
    if (homework.type !== HomeworkType.QUIZ) {
      throw new ForbiddenException('homework is not quiz');
    }

    const student = await this.studentRepository.findOne({
      where: { id: dto.studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    if (student.parentId !== actor.userId) {
      throw new ForbiddenException();
    }
    const visible = await this.isHomeworkVisibleToStudent(homework, student);
    if (!visible) {
      throw new ForbiddenException();
    }

    const questions = this.getQuizQuestions(homework.quiz);
    const total = questions.length;
    let correct = 0;
    for (let i = 0; i < total; i++) {
      const expected = questions[i]?.correctIndex;
      const got = dto.answers?.[i];
      if (typeof expected === 'number' && expected === got) {
        correct += 1;
      }
    }
    const score =
      total > 0 ? Math.round((correct / total) * 10 * 10) / 10 : null;

    const existing = await this.submissionRepository.findOne({
      where: { homeworkId, studentId: dto.studentId },
    });
    const submission = existing
      ? await this.submissionRepository.save({
          ...existing,
          parentId: actor.userId,
          quizAnswers: { answers: dto.answers },
          attachments: null,
          score,
          status: HomeworkSubmissionStatus.SUBMITTED,
          submittedAt: new Date(),
        })
      : await this.submissionRepository.save(
          this.submissionRepository.create({
            homeworkId,
            studentId: dto.studentId,
            parentId: actor.userId,
            quizAnswers: { answers: dto.answers },
            attachments: null,
            score,
            status: HomeworkSubmissionStatus.SUBMITTED,
          }),
        );

    return submission;
  }

  async submitEssay(
    actor: CurrentUserData,
    homeworkId: string,
    studentId: string,
    attachmentPaths: string[],
  ) {
    if (actor.role !== Role.PARENT) {
      throw new ForbiddenException();
    }

    const homework = await this.homeworkRepository.findOne({
      where: { id: homeworkId },
      relations: ['targets'],
    });
    if (!homework) {
      throw new NotFoundException('homework not found');
    }
    if (homework.type !== HomeworkType.ESSAY) {
      throw new ForbiddenException('homework is not essay');
    }

    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    if (student.parentId !== actor.userId) {
      throw new ForbiddenException();
    }
    const visible = await this.isHomeworkVisibleToStudent(homework, student);
    if (!visible) {
      throw new ForbiddenException();
    }

    const existing = await this.submissionRepository.findOne({
      where: { homeworkId, studentId },
    });
    const submission = existing
      ? await this.submissionRepository.save({
          ...existing,
          parentId: actor.userId,
          quizAnswers: null,
          attachments: { files: attachmentPaths },
          status: HomeworkSubmissionStatus.SUBMITTED,
          submittedAt: new Date(),
        })
      : await this.submissionRepository.save(
          this.submissionRepository.create({
            homeworkId,
            studentId,
            parentId: actor.userId,
            quizAnswers: null,
            attachments: { files: attachmentPaths },
            status: HomeworkSubmissionStatus.SUBMITTED,
          }),
        );

    return submission;
  }

  private async isHomeworkVisibleToStudent(
    homework: Homework,
    student: Student,
  ) {
    if (homework.targetScope === HomeworkTargetScope.CLASS) {
      return student.classId === homework.classId;
    }
    const count = await this.targetRepository.count({
      where: { homeworkId: homework.id, studentId: student.id },
    });
    return count > 0;
  }

  async listSubmissions(actor: CurrentUserData, homeworkId: string) {
    const homework = await this.homeworkRepository.findOne({
      where: { id: homeworkId },
    });
    if (!homework) {
      throw new NotFoundException('homework not found');
    }

    if (actor.role === Role.TEACHER && homework.teacherId !== actor.userId) {
      throw new ForbiddenException();
    }

    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    return this.submissionRepository.find({
      where: { homeworkId },
      relations: ['student', 'parent'],
      order: { submittedAt: 'DESC' },
    });
  }

  async gradeSubmission(
    actor: CurrentUserData,
    submissionId: string,
    dto: GradeSubmissionDto,
  ) {
    if (actor.role !== Role.TEACHER && actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const submission = await this.submissionRepository.findOne({
      where: { id: submissionId },
    });
    if (!submission) {
      throw new NotFoundException('submission not found');
    }
    const homework = await this.homeworkRepository.findOne({
      where: { id: submission.homeworkId },
    });
    if (!homework) {
      throw new NotFoundException('homework not found');
    }

    if (actor.role === Role.TEACHER && homework.teacherId !== actor.userId) {
      throw new ForbiddenException();
    }

    await this.submissionRepository.update(submissionId, {
      score: dto.score ?? submission.score,
      feedback: dto.feedback ?? submission.feedback,
      status: HomeworkSubmissionStatus.GRADED,
    });

    return this.submissionRepository.findOne({
      where: { id: submissionId },
      relations: ['student', 'parent'],
    });
  }

  async homeworkStatus(actor: CurrentUserData, homeworkId: string) {
    const homework = await this.homeworkRepository.findOne({
      where: { id: homeworkId },
    });
    if (!homework) {
      throw new NotFoundException('homework not found');
    }

    if (actor.role === Role.TEACHER && homework.teacherId !== actor.userId) {
      throw new ForbiddenException();
    }
    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    const students = await this.studentRepository.find({
      where: { classId: homework.classId },
    });
    const submissions = await this.submissionRepository.find({
      where: { homeworkId },
    });
    const byStudent = new Map(submissions.map((s) => [s.studentId, s]));

    if (homework.targetScope === HomeworkTargetScope.STUDENTS) {
      const targets = await this.targetRepository.find({
        where: { homeworkId },
      });
      const targetSet = new Set(targets.map((t) => t.studentId));
      const targetStudents = students.filter((s) => targetSet.has(s.id));
      return targetStudents.map((s) => {
        const sub = byStudent.get(s.id);
        return {
          studentId: s.id,
          studentName: s.name,
          status: sub?.status || 'not_submitted',
          score: sub?.score ?? null,
          submissionId: sub?.id ?? null,
        };
      });
    }

    return students.map((s) => {
      const sub = byStudent.get(s.id);
      return {
        studentId: s.id,
        studentName: s.name,
        status: sub?.status || 'not_submitted',
        score: sub?.score ?? null,
        submissionId: sub?.id ?? null,
      };
    });
  }
}
