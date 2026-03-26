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
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_entity_1 = require("../classes/entities/class.entity");
const user_entity_1 = require("../users/entities/user.entity");
const course_entity_1 = require("./entities/course.entity");
let CoursesService = class CoursesService {
    courseRepository;
    classRepository;
    userRepository;
    constructor(courseRepository, classRepository, userRepository) {
        this.courseRepository = courseRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }
    async create(actor, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: dto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        if (dto.teacherId) {
            const teacher = await this.userRepository.findOne({
                where: { id: dto.teacherId },
            });
            if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
                throw new common_1.ForbiddenException('teacherId is not a teacher');
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
    async findAll(actor) {
        if (actor.role === role_enum_1.Role.ADMIN) {
            return this.courseRepository.find({ relations: ['class', 'teacher'] });
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            return this.courseRepository.find({
                where: { teacherId: actor.userId },
                relations: ['class'],
            });
        }
        throw new common_1.ForbiddenException();
    }
    async findById(actor, id) {
        const course = await this.courseRepository.findOne({
            where: { id },
            relations: ['class', 'teacher'],
        });
        if (!course) {
            throw new common_1.NotFoundException();
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return course;
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (course.teacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return course;
        }
        throw new common_1.ForbiddenException();
    }
    async update(actor, id, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const course = await this.courseRepository.findOne({ where: { id } });
        if (!course) {
            throw new common_1.NotFoundException();
        }
        if (dto.classId) {
            const classEntity = await this.classRepository.findOne({
                where: { id: dto.classId },
            });
            if (!classEntity) {
                throw new common_1.NotFoundException('class not found');
            }
        }
        if (dto.teacherId) {
            const teacher = await this.userRepository.findOne({
                where: { id: dto.teacherId },
            });
            if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
                throw new common_1.ForbiddenException('teacherId is not a teacher');
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
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(course_entity_1.Course)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map