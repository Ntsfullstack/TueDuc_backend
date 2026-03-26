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
exports.AssessmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const course_entity_1 = require("../courses/entities/course.entity");
const student_entity_1 = require("../students/entities/student.entity");
const assessment_entity_1 = require("./entities/assessment.entity");
let AssessmentsService = class AssessmentsService {
    assessmentRepository;
    studentRepository;
    courseRepository;
    constructor(assessmentRepository, studentRepository, courseRepository) {
        this.assessmentRepository = assessmentRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }
    async create(actor, assessmentData) {
        if (actor.role !== role_enum_1.Role.TEACHER && actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const course = await this.courseRepository.findOne({
            where: { id: assessmentData.courseId },
        });
        if (!course) {
            throw new common_1.NotFoundException('course not found');
        }
        const student = await this.studentRepository.findOne({
            where: { id: assessmentData.studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (course.teacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            if (student.classId &&
                course.classId &&
                student.classId !== course.classId) {
                throw new common_1.ForbiddenException('student is not in course class');
            }
            assessmentData.teacherId = actor.userId;
        }
        const assessment = this.assessmentRepository.create(assessmentData);
        return this.assessmentRepository.save(assessment);
    }
    async findAllByStudent(actor, studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        if (actor.role === role_enum_1.Role.PARENT && student.parentId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            const items = await this.assessmentRepository.find({
                where: { studentId },
                relations: ['course', 'teacher'],
            });
            return items.filter((a) => a.teacherId === actor.userId);
        }
        if (actor.role === role_enum_1.Role.ADMIN || actor.role === role_enum_1.Role.PARENT) {
            return this.assessmentRepository.find({
                where: { studentId },
                relations: ['course', 'teacher'],
            });
        }
        throw new common_1.ForbiddenException();
    }
    async findById(actor, id) {
        const assessment = await this.assessmentRepository.findOne({
            where: { id },
            relations: ['student', 'course', 'teacher'],
        });
        if (!assessment) {
            throw new common_1.NotFoundException(`Assessment with ID ${id} not found`);
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return assessment;
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (assessment.teacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return assessment;
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            if (assessment.student?.parentId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return assessment;
        }
        throw new common_1.ForbiddenException();
    }
    async update(actor, id, updateData) {
        const existing = await this.findById(actor, id);
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.TEACHER && existing.teacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        await this.assessmentRepository.update(id, updateData);
        return this.findById(actor, id);
    }
    async getThreeRootsSummary(actor, studentId) {
        const assessments = await this.findAllByStudent(actor, studentId);
        if (assessments.length === 0)
            return null;
        const total = assessments.length;
        const summary = assessments.reduce((acc, curr) => ({
            ethics: acc.ethics + Number(curr.ethicsScore || 0),
            wisdom: acc.wisdom + Number(curr.wisdomScore || 0),
            willpower: acc.willpower + Number(curr.willpowerScore || 0),
        }), { ethics: 0, wisdom: 0, willpower: 0 });
        return {
            avgEthics: summary.ethics / total,
            avgWisdom: summary.wisdom / total,
            avgWillpower: summary.willpower / total,
            totalAssessments: total,
        };
    }
};
exports.AssessmentsService = AssessmentsService;
exports.AssessmentsService = AssessmentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(assessment_entity_1.Assessment)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AssessmentsService);
//# sourceMappingURL=assessments.service.js.map