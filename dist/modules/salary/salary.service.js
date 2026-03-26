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
exports.SalaryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const class_schedule_entity_1 = require("../schedules/entities/class-schedule.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const user_entity_1 = require("../users/entities/user.entity");
const teacher_salary_rate_entity_1 = require("./entities/teacher-salary-rate.entity");
let SalaryService = class SalaryService {
    rateRepository;
    scheduleRepository;
    shiftRepository;
    userRepository;
    constructor(rateRepository, scheduleRepository, shiftRepository, userRepository) {
        this.rateRepository = rateRepository;
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.userRepository = userRepository;
    }
    parseMonth(month) {
        const m = /^(\d{4})-(\d{2})$/.exec(month);
        if (!m) {
            throw new common_1.NotFoundException('invalid month');
        }
        const year = parseInt(m[1], 10);
        const mon = parseInt(m[2], 10);
        const start = new Date(Date.UTC(year, mon - 1, 1));
        const end = new Date(Date.UTC(year, mon, 0));
        return { year, mon, start, end };
    }
    countWeekdayInMonth(year, mon, weekday) {
        const start = new Date(Date.UTC(year, mon - 1, 1));
        const end = new Date(Date.UTC(year, mon, 0));
        let count = 0;
        for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
            if (d.getUTCDay() === weekday) {
                count += 1;
            }
        }
        return count;
    }
    async setTeacherRate(actor, teacherId, shiftId, amountPerSession) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
            throw new common_1.NotFoundException('teacher not found');
        }
        const shift = await this.shiftRepository.findOne({
            where: { id: shiftId },
        });
        if (!shift) {
            throw new common_1.NotFoundException('shift not found');
        }
        const existing = await this.rateRepository.findOne({
            where: { teacherId, shiftId },
        });
        if (!existing) {
            return this.rateRepository.save(this.rateRepository.create({ teacherId, shiftId, amountPerSession }));
        }
        await this.rateRepository.update(existing.id, { amountPerSession });
        return this.rateRepository.findOne({
            where: { id: existing.id },
            relations: ['shift'],
        });
    }
    async listTeacherRates(actor, teacherId) {
        if (actor.role !== role_enum_1.Role.ADMIN &&
            !(actor.role === role_enum_1.Role.TEACHER && actor.userId === teacherId)) {
            throw new common_1.ForbiddenException();
        }
        return this.rateRepository.find({
            where: { teacherId },
            relations: ['shift'],
        });
    }
    async getTeacherSalaryByMonth(actor, teacherId, month) {
        if (actor.role === role_enum_1.Role.TEACHER && actor.userId !== teacherId) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const teacher = await this.userRepository.findOne({
            where: { id: teacherId },
        });
        if (!teacher || teacher.role !== role_enum_1.Role.TEACHER) {
            throw new common_1.NotFoundException('teacher not found');
        }
        const { year, mon } = this.parseMonth(month);
        const schedules = await this.scheduleRepository.find({
            where: { teacherId },
            relations: ['class', 'shift'],
        });
        const rates = await this.rateRepository.find({ where: { teacherId } });
        const rateByShift = new Map(rates.map((r) => [r.shiftId, Number(r.amountPerSession)]));
        const breakdown = schedules.map((s) => {
            const sessions = this.countWeekdayInMonth(year, mon, s.weekday);
            const rate = rateByShift.get(s.shiftId) ?? 0;
            const amount = sessions * rate;
            return {
                classId: s.classId,
                className: s.class?.name,
                weekday: s.weekday,
                shiftId: s.shiftId,
                shiftName: s.shift?.name,
                sessions,
                rate,
                amount,
            };
        });
        const totalSessions = breakdown.reduce((sum, b) => sum + b.sessions, 0);
        const totalAmount = breakdown.reduce((sum, b) => sum + b.amount, 0);
        return {
            teacherId,
            month,
            totalSessions,
            totalAmount,
            breakdown,
        };
    }
};
exports.SalaryService = SalaryService;
exports.SalaryService = SalaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(teacher_salary_rate_entity_1.TeacherSalaryRate)),
    __param(1, (0, typeorm_1.InjectRepository)(class_schedule_entity_1.ClassSchedule)),
    __param(2, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SalaryService);
//# sourceMappingURL=salary.service.js.map