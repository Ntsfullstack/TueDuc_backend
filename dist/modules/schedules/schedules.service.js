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
exports.SchedulesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const class_schedule_entity_1 = require("./entities/class-schedule.entity");
let SchedulesService = class SchedulesService {
    scheduleRepository;
    classRepository;
    studentRepository;
    userRepository;
    shiftRepository;
    constructor(scheduleRepository, classRepository, studentRepository, userRepository, shiftRepository) {
        this.scheduleRepository = scheduleRepository;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.shiftRepository = shiftRepository;
    }
    async createClassSchedule(actor, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: dto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        const shift = await this.shiftRepository.findOne({
            where: { id: dto.shiftId },
        });
        if (!shift) {
            throw new common_1.NotFoundException('shift not found');
        }
        const teacher = await this.userRepository.findOne({
            where: { id: dto.teacherId },
        });
        if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
            throw new common_1.NotFoundException('teacher not found');
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
            throw new common_1.ForbiddenException('teacher schedule conflict');
        }
        const created = await this.scheduleRepository.save(this.scheduleRepository.create(dto));
        return this.scheduleRepository.findOne({
            where: { id: created.id },
            relations: ['class', 'shift', 'teacher'],
        });
    }
    async listByClass(actor, classId) {
        const classEntity = await this.classRepository.findOne({
            where: { id: classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER &&
            classEntity.homeroomTeacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        return this.scheduleRepository.find({
            where: { classId },
            relations: ['class', 'shift', 'teacher'],
        });
    }
    weekdayFromDate(date) {
        const d = new Date(date);
        return d.getDay();
    }
    async getStudentScheduleByDate(actor, studentId, date) {
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
            const classEntity = await this.classRepository.findOne({
                where: { id: student.classId },
            });
            if (!classEntity || classEntity.homeroomTeacherId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
        }
        const weekday = this.weekdayFromDate(date);
        return this.scheduleRepository.find({
            where: { classId: student.classId, weekday },
            relations: ['class', 'shift', 'teacher'],
        });
    }
    async getTeacherScheduleByDate(actor, date) {
        if (actor.role !== role_enum_1.Role.TEACHER && actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const weekday = this.weekdayFromDate(date);
        const teacherId = actor.userId;
        return this.scheduleRepository.find({
            where: { teacherId, weekday },
            relations: ['class', 'shift', 'teacher'],
        });
    }
    async getTeacherScheduleByDateForTeacher(actor, teacherId, date) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
            throw new common_1.NotFoundException('teacher not found');
        }
        const weekday = this.weekdayFromDate(date);
        return this.scheduleRepository.find({
            where: { teacherId, weekday },
            relations: ['class', 'shift', 'teacher'],
        });
    }
    parseStartDate(start) {
        const d = new Date(start);
        if (Number.isNaN(d.getTime())) {
            throw new common_1.NotFoundException('invalid start date');
        }
        return d;
    }
    async getCenterScheduleWeek(actor, start) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        this.parseStartDate(start);
        const items = await this.scheduleRepository.find({
            relations: ['class', 'shift', 'teacher'],
        });
        return { start, items };
    }
};
exports.SchedulesService = SchedulesService;
exports.SchedulesService = SchedulesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_schedule_entity_1.ClassSchedule)),
    __param(1, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SchedulesService);
//# sourceMappingURL=schedules.service.js.map