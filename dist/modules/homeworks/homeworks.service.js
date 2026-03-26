"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const homework_entity_1 = require("./entities/homework.entity");
const homework_submission_entity_1 = require("./entities/homework-submission.entity");
const homework_target_entity_1 = require("./entities/homework-target.entity");
let HomeworksService = class HomeworksService {
    homeworkRepository;
    targetRepository;
    submissionRepository;
    classRepository;
    studentRepository;
    userRepository;
    isRecord(value) {
        return typeof value === 'object' && value !== null;
    }
    getQuizQuestions(quiz) {
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
            correctIndex: typeof q['correctIndex'] === 'number' ? q['correctIndex'] : undefined,
        }))
            .filter((q) => q.prompt.length > 0);
    }
    constructor(homeworkRepository, targetRepository, submissionRepository, classRepository, studentRepository, userRepository) {
        this.homeworkRepository = homeworkRepository;
        this.targetRepository = targetRepository;
        this.submissionRepository = submissionRepository;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
    }
    stripQuizAnswersIfNeeded(actor, homework) {
        if (homework.type !== homework_entity_1.HomeworkType.QUIZ) {
            return homework;
        }
        if (!homework.quiz) {
            return homework;
        }
        if (actor.role === role_enum_1.Role.TEACHER || actor.role === role_enum_1.Role.ADMIN) {
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
        };
    }
    async create(actor, dto) {
        if (actor.role !== role_enum_1.Role.TEACHER && actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: dto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        let teacherId = actor.userId;
        if (actor.role === role_enum_1.Role.ADMIN) {
            teacherId =
                dto.teacherId || classEntity.homeroomTeacherId || actor.userId;
        }
        if (actor.role === role_enum_1.Role.TEACHER &&
            classEntity.homeroomTeacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        const homework = await this.homeworkRepository.save(this.homeworkRepository.create({
            title: dto.title,
            description: dto.description,
            type: dto.type,
            dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined,
            classId: dto.classId,
            teacherId,
            targetScope: dto.targetScope,
            quiz: dto.type === homework_entity_1.HomeworkType.QUIZ
                ? {
                    questions: (dto.quizQuestions || []).map((q) => ({
                        prompt: q.prompt,
                        options: q.options,
                        correctIndex: q.correctIndex,
                    })),
                }
                : null,
        }));
        if (dto.targetScope === homework_entity_1.HomeworkTargetScope.STUDENTS) {
            const ids = dto.studentIds || [];
            if (ids.length === 0) {
                throw new common_1.ForbiddenException('studentIds required for targetScope=students');
            }
            const students = await this.studentRepository
                .createQueryBuilder('student')
                .where('student.id IN (:...ids)', { ids })
                .getMany();
            const studentById = new Map(students.map((s) => [s.id, s]));
            for (const id of ids) {
                const s = studentById.get(id);
                if (!s) {
                    throw new common_1.NotFoundException(`student not found: ${id}`);
                }
                if (s.classId !== dto.classId) {
                    throw new common_1.ForbiddenException(`student not in class: ${id}`);
                }
            }
            await this.targetRepository.save(ids.map((studentId) => this.targetRepository.create({ homeworkId: homework.id, studentId })));
        }
        const created = await this.homeworkRepository.findOne({
            where: { id: homework.id },
            relations: ['class', 'teacher', 'targets', 'targets.student'],
        });
        return this.stripQuizAnswersIfNeeded(actor, created);
    }
    async update(actor, id, dto) {
        const homework = await this.homeworkRepository.findOne({ where: { id } });
        if (!homework) {
            throw new common_1.NotFoundException();
        }
        if (actor.role === role_enum_1.Role.TEACHER && homework.teacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
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
        return this.stripQuizAnswersIfNeeded(actor, updated);
    }
    async findById(actor, id) {
        const homework = await this.homeworkRepository.findOne({
            where: { id },
            relations: ['class', 'teacher', 'targets', 'targets.student'],
        });
        if (!homework) {
            throw new common_1.NotFoundException();
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return this.stripQuizAnswersIfNeeded(actor, homework);
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (homework.teacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return this.stripQuizAnswersIfNeeded(actor, homework);
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            const children = await this.studentRepository.find({
                where: { parentId: actor.userId },
            });
            const childIds = new Set(children.map((c) => c.id));
            const canSee = await this.isHomeworkVisibleToAnyStudent(homework, childIds);
            if (!canSee) {
                throw new common_1.ForbiddenException();
            }
            return this.stripQuizAnswersIfNeeded(actor, homework);
        }
        throw new common_1.ForbiddenException();
    }
    async isHomeworkVisibleToAnyStudent(homework, studentIds) {
        if (homework.targetScope === homework_entity_1.HomeworkTargetScope.CLASS) {
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
    async list(actor, studentId) {
        if (actor.role === role_enum_1.Role.ADMIN) {
            const list = await this.homeworkRepository.find({
                relations: ['class', 'teacher', 'targets'],
            });
            return list.map((h) => this.stripQuizAnswersIfNeeded(actor, h));
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            const list = await this.homeworkRepository.find({
                where: { teacherId: actor.userId },
                relations: ['class', 'teacher', 'targets'],
            });
            return list.map((h) => this.stripQuizAnswersIfNeeded(actor, h));
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            if (studentId) {
                const child = await this.studentRepository.findOne({
                    where: { id: studentId, parentId: actor.userId },
                });
                if (!child) {
                    throw new common_1.ForbiddenException();
                }
                const query = this.homeworkRepository.createQueryBuilder('homework');
                query.leftJoinAndSelect('homework.teacher', 'teacher');
                query.leftJoinAndSelect('homework.class', 'class');
                query.leftJoinAndSelect('homework.targets', 'targets');
                query.where('homework.targetScope = :scopeClass AND homework.classId = :classId', {
                    scopeClass: homework_entity_1.HomeworkTargetScope.CLASS,
                    classId: child.classId,
                });
                query.orWhere('homework.targetScope = :scopeStudents AND targets.studentId = :studentId', {
                    scopeStudents: homework_entity_1.HomeworkTargetScope.STUDENTS,
                    studentId: child.id,
                });
                const list = await query.getMany();
                const unique = new Map(list.map((h) => [h.id, h]));
                return Array.from(unique.values()).map((h) => this.stripQuizAnswersIfNeeded(actor, h));
            }
            const children = await this.studentRepository.find({
                where: { parentId: actor.userId },
            });
            const childIds = children.map((c) => c.id);
            const classIds = Array.from(new Set(children.map((c) => c.classId).filter(Boolean)));
            const query = this.homeworkRepository.createQueryBuilder('homework');
            query.leftJoinAndSelect('homework.teacher', 'teacher');
            query.leftJoinAndSelect('homework.class', 'class');
            query.leftJoinAndSelect('homework.targets', 'targets');
            query.where('homework.targetScope = :scopeClass AND homework.classId IN (:...classIds)', {
                scopeClass: homework_entity_1.HomeworkTargetScope.CLASS,
                classIds: classIds.length
                    ? classIds
                    : ['00000000-0000-0000-0000-000000000000'],
            });
            if (childIds.length) {
                query.orWhere('homework.targetScope = :scopeStudents AND targets.studentId IN (:...childIds)', {
                    scopeStudents: homework_entity_1.HomeworkTargetScope.STUDENTS,
                    childIds,
                });
            }
            const list = await query.getMany();
            const unique = new Map(list.map((h) => [h.id, h]));
            return Array.from(unique.values()).map((h) => this.stripQuizAnswersIfNeeded(actor, h));
        }
        throw new common_1.ForbiddenException();
    }
    async submitQuiz(actor, homeworkId, dto) {
        if (actor.role !== role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const homework = await this.homeworkRepository.findOne({
            where: { id: homeworkId },
            relations: ['targets'],
        });
        if (!homework) {
            throw new common_1.NotFoundException('homework not found');
        }
        if (homework.type !== homework_entity_1.HomeworkType.QUIZ) {
            throw new common_1.ForbiddenException('homework is not quiz');
        }
        const student = await this.studentRepository.findOne({
            where: { id: dto.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        if (student.parentId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        const visible = await this.isHomeworkVisibleToStudent(homework, student);
        if (!visible) {
            throw new common_1.ForbiddenException();
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
        const score = total > 0 ? Math.round((correct / total) * 10 * 10) / 10 : null;
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
                status: homework_submission_entity_1.HomeworkSubmissionStatus.SUBMITTED,
                submittedAt: new Date(),
            })
            : await this.submissionRepository.save(this.submissionRepository.create({
                homeworkId,
                studentId: dto.studentId,
                parentId: actor.userId,
                quizAnswers: { answers: dto.answers },
                attachments: null,
                score,
                status: homework_submission_entity_1.HomeworkSubmissionStatus.SUBMITTED,
            }));
        return submission;
    }
    async submitEssay(actor, homeworkId, studentId, attachmentPaths) {
        if (actor.role !== role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const homework = await this.homeworkRepository.findOne({
            where: { id: homeworkId },
            relations: ['targets'],
        });
        if (!homework) {
            throw new common_1.NotFoundException('homework not found');
        }
        if (homework.type !== homework_entity_1.HomeworkType.ESSAY) {
            throw new common_1.ForbiddenException('homework is not essay');
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        if (student.parentId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        const visible = await this.isHomeworkVisibleToStudent(homework, student);
        if (!visible) {
            throw new common_1.ForbiddenException();
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
                status: homework_submission_entity_1.HomeworkSubmissionStatus.SUBMITTED,
                submittedAt: new Date(),
            })
            : await this.submissionRepository.save(this.submissionRepository.create({
                homeworkId,
                studentId,
                parentId: actor.userId,
                quizAnswers: null,
                attachments: { files: attachmentPaths },
                status: homework_submission_entity_1.HomeworkSubmissionStatus.SUBMITTED,
            }));
        return submission;
    }
    async isHomeworkVisibleToStudent(homework, student) {
        if (homework.targetScope === homework_entity_1.HomeworkTargetScope.CLASS) {
            return student.classId === homework.classId;
        }
        const count = await this.targetRepository.count({
            where: { homeworkId: homework.id, studentId: student.id },
        });
        return count > 0;
    }
    async listSubmissions(actor, homeworkId) {
        const homework = await this.homeworkRepository.findOne({
            where: { id: homeworkId },
        });
        if (!homework) {
            throw new common_1.NotFoundException('homework not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER && homework.teacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        return this.submissionRepository.find({
            where: { homeworkId },
            relations: ['student', 'parent'],
            order: { submittedAt: 'DESC' },
        });
    }
    async gradeSubmission(actor, submissionId, dto) {
        if (actor.role !== role_enum_1.Role.TEACHER && actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const submission = await this.submissionRepository.findOne({
            where: { id: submissionId },
        });
        if (!submission) {
            throw new common_1.NotFoundException('submission not found');
        }
        const homework = await this.homeworkRepository.findOne({
            where: { id: submission.homeworkId },
        });
        if (!homework) {
            throw new common_1.NotFoundException('homework not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER && homework.teacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        await this.submissionRepository.update(submissionId, {
            score: dto.score ?? submission.score,
            feedback: dto.feedback ?? submission.feedback,
            status: homework_submission_entity_1.HomeworkSubmissionStatus.GRADED,
        });
        return this.submissionRepository.findOne({
            where: { id: submissionId },
            relations: ['student', 'parent'],
        });
    }
    async homeworkStatus(actor, homeworkId) {
        const homework = await this.homeworkRepository.findOne({
            where: { id: homeworkId },
        });
        if (!homework) {
            throw new common_1.NotFoundException('homework not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER && homework.teacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const students = await this.studentRepository.find({
            where: { classId: homework.classId },
        });
        const submissions = await this.submissionRepository.find({
            where: { homeworkId },
        });
        const byStudent = new Map(submissions.map((s) => [s.studentId, s]));
        if (homework.targetScope === homework_entity_1.HomeworkTargetScope.STUDENTS) {
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
};
exports.HomeworksService = HomeworksService;
exports.HomeworksService = HomeworksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(homework_entity_1.Homework)),
    __param(1, (0, typeorm_1.InjectRepository)(homework_target_entity_1.HomeworkTarget)),
    __param(2, (0, typeorm_1.InjectRepository)(homework_submission_entity_1.HomeworkSubmission)),
    __param(3, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(4, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], HomeworksService);
//# sourceMappingURL=homeworks.service.js.map