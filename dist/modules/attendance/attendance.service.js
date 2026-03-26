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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const attendance_record_entity_1 = require("./entities/attendance-record.entity");
const attendance_session_entity_1 = require("./entities/attendance-session.entity");
const attendance_edit_log_entity_1 = require("./entities/attendance-edit-log.entity");
let AttendanceService = class AttendanceService {
    sessionRepository;
    recordRepository;
    classRepository;
    studentRepository;
    editLogRepository;
    constructor(sessionRepository, recordRepository, classRepository, studentRepository, editLogRepository) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.editLogRepository = editLogRepository;
    }
    async mark(actor, dto) {
        if (actor.role !== role_enum_1.Role.TEACHER && actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const classEntity = await this.classRepository.findOne({
            where: { id: dto.classId },
        });
        if (!classEntity) {
            throw new common_1.NotFoundException('class not found');
        }
        if (actor.role === role_enum_1.Role.TEACHER &&
            classEntity.homeroomTeacherId !== actor.userId) {
            throw new common_1.ForbiddenException();
        }
        let session = await this.sessionRepository.findOne({
            where: { classId: dto.classId, date: dto.date, shiftId: dto.shiftId },
        });
        if (!session) {
            session = await this.sessionRepository.save(this.sessionRepository.create({
                classId: dto.classId,
                date: dto.date,
                shiftId: dto.shiftId,
                teacherId: actor.role === role_enum_1.Role.ADMIN
                    ? classEntity.homeroomTeacherId || actor.userId
                    : actor.userId,
            }));
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
                throw new common_1.NotFoundException(`student not found: ${r.studentId}`);
            }
            if (student.classId !== dto.classId) {
                throw new common_1.ForbiddenException(`student not in class: ${r.studentId}`);
            }
        }
        for (const r of dto.records) {
            const existing = await this.recordRepository.findOne({
                where: { sessionId: session.id, studentId: r.studentId },
            });
            if (!existing) {
                await this.recordRepository.save(this.recordRepository.create({
                    sessionId: session.id,
                    studentId: r.studentId,
                    status: r.status || attendance_record_entity_1.AttendanceStatus.PRESENT,
                    note: r.note,
                }));
            }
            else {
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
    async getByClassDate(actor, classId, date, shiftId) {
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
        const session = await this.sessionRepository.findOne({
            where: { classId, date, shiftId },
            relations: ['class', 'shift', 'records', 'records.student'],
        });
        return session;
    }
    async getByStudent(actor, studentId) {
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
        return this.recordRepository
            .createQueryBuilder('record')
            .leftJoinAndSelect('record.session', 'session')
            .leftJoinAndSelect('session.shift', 'shift')
            .where('record.studentId = :studentId', { studentId })
            .orderBy('session.date', 'DESC')
            .getMany();
    }
    async adminListSessions(actor, date, shiftId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        return this.sessionRepository.find({
            where: { date, shiftId },
            relations: ['class', 'shift', 'records', 'records.student'],
        });
    }
    async adminUpdateSession(actor, sessionId, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const session = await this.sessionRepository.findOne({
            where: { id: sessionId },
            relations: ['class', 'shift', 'records', 'records.student'],
        });
        if (!session) {
            throw new common_1.NotFoundException('session not found');
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
                await this.recordRepository.save(this.recordRepository.create({
                    sessionId,
                    studentId: patch.studentId,
                    status: patch.status,
                    note: patch.note,
                }));
            }
            else {
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
            throw new common_1.NotFoundException('session not found');
        }
        const after = (updated.records || []).map((r) => ({
            studentId: r.studentId,
            status: r.status,
            note: r.note ?? null,
        }));
        await this.editLogRepository.save(this.editLogRepository.create({
            sessionId,
            editorId: actor.userId,
            reason: dto.reason ?? null,
            before,
            after,
        }));
        return updated;
    }
    async adminEditLogs(actor, sessionId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        return this.editLogRepository.find({
            where: { sessionId },
            order: { createdAt: 'DESC' },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_session_entity_1.AttendanceSession)),
    __param(1, (0, typeorm_1.InjectRepository)(attendance_record_entity_1.AttendanceRecord)),
    __param(2, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(3, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(4, (0, typeorm_1.InjectRepository)(attendance_edit_log_entity_1.AttendanceEditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map