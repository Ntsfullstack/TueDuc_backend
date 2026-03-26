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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_entity_1 = require("../classes/entities/class.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_entity_1 = require("./entities/student.entity");
let StudentsService = class StudentsService {
    studentRepository;
    classRepository;
    userRepository;
    constructor(studentRepository, classRepository, userRepository) {
        this.studentRepository = studentRepository;
        this.classRepository = classRepository;
        this.userRepository = userRepository;
    }
    generateStudentCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
        return `HS-${rand}`;
    }
    async create(actor, dto) {
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        if (dto.classId && actor.role === role_enum_1.Role.TEACHER) {
            const classEntity = await this.classRepository.findOne({
                where: { id: dto.classId },
            });
            if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
        }
        if (dto.parentId) {
            const parent = await this.userRepository.findOne({
                where: { id: dto.parentId },
            });
            if (!parent || parent.role !== role_enum_1.Role.PARENT) {
                throw new common_1.ForbiddenException('parentId is not a parent');
            }
        }
        let studentCode;
        let attempts = 0;
        do {
            studentCode = this.generateStudentCode();
            const existing = await this.studentRepository.findOne({
                where: { studentCode },
            });
            if (!existing)
                break;
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
    async findMyChildren(actor) {
        if (actor.role !== role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        return this.studentRepository.find({
            where: { parentId: actor.userId },
            relations: ['class'],
        });
    }
    async findAll(actor) {
        if (actor.role === role_enum_1.Role.ADMIN) {
            return this.studentRepository.find({ relations: ['class', 'parent'] });
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
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
        throw new common_1.ForbiddenException();
    }
    async findById(actor, id) {
        const student = await this.studentRepository.findOne({
            where: { id },
            relations: ['class', 'parent'],
        });
        if (!student) {
            throw new common_1.NotFoundException();
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return student;
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            if (student.parentId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return student;
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            if (student.class?.homeroomTeacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return student;
        }
        throw new common_1.ForbiddenException();
    }
    async update(actor, id, dto) {
        const student = await this.findById(actor, id);
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        if (dto.classId && actor.role === role_enum_1.Role.TEACHER) {
            const classEntity = await this.classRepository.findOne({
                where: { id: dto.classId },
            });
            if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
        }
        if (dto.parentId) {
            const parent = await this.userRepository.findOne({
                where: { id: dto.parentId },
            });
            if (!parent || parent.role !== role_enum_1.Role.PARENT) {
                throw new common_1.ForbiddenException('parentId is not a parent');
            }
        }
        const patch = {
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
    async transfer(actor, id, classId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({ where: { id } });
        if (!student) {
            throw new common_1.NotFoundException();
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        await this.studentRepository.update(id, { classId });
        return this.studentRepository.findOne({
            where: { id },
            relations: ['class', 'parent'],
        });
    }
    async remove(actor, id) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({ where: { id } });
        if (!student) {
            throw new common_1.NotFoundException();
        }
        await this.studentRepository.delete(id);
        return { deleted: true };
    }
    async linkParent(actor, studentId, parentId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const parent = await this.userRepository.findOne({
            where: { id: parentId },
        });
        if (!parent) {
            throw new common_1.NotFoundException('Parent user not found');
        }
        if (parent.role !== role_enum_1.Role.PARENT) {
            throw new common_1.BadRequestException('The specified user does not have the parent role');
        }
        await this.studentRepository.update(studentId, { parentId });
        return this.studentRepository.findOne({
            where: { id: studentId },
            relations: ['class', 'parent'],
        });
    }
    async unlinkParent(actor, studentId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        await this.studentRepository
            .createQueryBuilder()
            .update(student_entity_1.Student)
            .set({ parentId: () => 'NULL' })
            .where('id = :id', { id: studentId })
            .execute();
        return this.studentRepository.findOne({
            where: { id: studentId },
            relations: ['class', 'parent'],
        });
    }
    async claimStudent(actor, studentCode) {
        if (actor.role !== role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { studentCode },
            relations: ['class', 'parent'],
        });
        if (!student) {
            throw new common_1.NotFoundException('Mã học sinh không tồn tại');
        }
        if (student.parentId === actor.userId) {
            return student;
        }
        if (student.parentId) {
            throw new common_1.ConflictException('Mã học sinh này đã được liên kết với một tài khoản phụ huynh khác');
        }
        await this.studentRepository.update(student.id, { parentId: actor.userId });
        return this.studentRepository.findOne({
            where: { id: student.id },
            relations: ['class', 'parent'],
        });
    }
    async regenerateCode(actor, studentId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        let studentCode;
        let attempts = 0;
        do {
            studentCode = this.generateStudentCode();
            const existing = await this.studentRepository.findOne({
                where: { studentCode },
            });
            if (!existing)
                break;
            attempts++;
        } while (attempts < 5);
        await this.studentRepository.update(studentId, { studentCode });
        return this.studentRepository.findOne({
            where: { id: studentId },
            relations: ['class', 'parent'],
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], StudentsService);
//# sourceMappingURL=students.service.js.map