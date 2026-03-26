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
exports.ClassesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const user_entity_1 = require("../users/entities/user.entity");
const class_entity_1 = require("./entities/class.entity");
let ClassesService = class ClassesService {
    classRepository;
    userRepository;
    constructor(classRepository, userRepository) {
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }
    async create(actor, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        if (dto.homeroomTeacherId) {
            const teacher = await this.userRepository.findOne({
                where: { id: dto.homeroomTeacherId },
            });
            if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
                throw new common_1.ForbiddenException('homeroomTeacherId is not a teacher');
            }
        }
        const classEntity = this.classRepository.create({
            name: dto.name,
            grade: dto.grade,
            academicYear: dto.academicYear,
            homeroomTeacherId: dto.homeroomTeacherId,
            maxStudents: dto.maxStudents ?? null,
        });
        return this.classRepository.save(classEntity);
    }
    async findAll(actor) {
        if (actor.role === role_enum_1.Role.ADMIN) {
            return this.classRepository.find({
                relations: ['homeroomTeacher', 'students'],
            });
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            return this.classRepository.find({
                where: { homeroomTeacherId: actor.userId },
                relations: ['students'],
            });
        }
        throw new common_1.ForbiddenException();
    }
    async findById(actor, id) {
        const classEntity = await this.classRepository.findOne({
            where: { id },
            relations: ['homeroomTeacher', 'students'],
        });
        if (!classEntity) {
            throw new common_1.NotFoundException();
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return classEntity;
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (classEntity.homeroomTeacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return classEntity;
        }
        throw new common_1.ForbiddenException();
    }
    async update(actor, id, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({ where: { id } });
        if (!classEntity) {
            throw new common_1.NotFoundException();
        }
        if (dto.homeroomTeacherId) {
            const teacher = await this.userRepository.findOne({
                where: { id: dto.homeroomTeacherId },
            });
            if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
                throw new common_1.ForbiddenException('homeroomTeacherId is not a teacher');
            }
        }
        await this.classRepository.update(id, {
            name: dto.name ?? classEntity.name,
            grade: dto.grade ?? classEntity.grade,
            academicYear: dto.academicYear ?? classEntity.academicYear,
            homeroomTeacherId: dto.homeroomTeacherId ?? classEntity.homeroomTeacherId,
            status: dto.status ?? classEntity.status,
            maxStudents: dto.maxStudents ?? classEntity.maxStudents,
        });
        return this.classRepository.findOne({
            where: { id },
            relations: ['homeroomTeacher', 'students'],
        });
    }
    async remove(actor, id) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({ where: { id } });
        if (!classEntity) {
            throw new common_1.NotFoundException();
        }
        await this.classRepository.delete(id);
        return { deleted: true };
    }
    async archive(actor, id) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({ where: { id } });
        if (!classEntity) {
            throw new common_1.NotFoundException();
        }
        await this.classRepository.update(id, {
            archivedAt: new Date(),
            status: class_entity_1.ClassStatus.CLOSED,
        });
        return this.classRepository.findOne({
            where: { id },
            relations: ['homeroomTeacher', 'students'],
        });
    }
    async setStatus(actor, id, status) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({ where: { id } });
        if (!classEntity) {
            throw new common_1.NotFoundException();
        }
        await this.classRepository.update(id, { status });
        return this.classRepository.findOne({
            where: { id },
            relations: ['homeroomTeacher', 'students'],
        });
    }
    async clone(actor, id) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const source = await this.classRepository.findOne({ where: { id } });
        if (!source) {
            throw new common_1.NotFoundException();
        }
        const cloned = await this.classRepository.save(this.classRepository.create({
            name: `${source.name} (Clone)`,
            grade: source.grade,
            academicYear: source.academicYear,
            homeroomTeacherId: source.homeroomTeacherId,
            status: source.status,
            maxStudents: source.maxStudents,
            archivedAt: null,
            clonedFromId: source.id,
        }));
        return this.classRepository.findOne({
            where: { id: cloned.id },
            relations: ['homeroomTeacher', 'students'],
        });
    }
};
exports.ClassesService = ClassesService;
exports.ClassesService = ClassesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ClassesService);
//# sourceMappingURL=classes.service.js.map