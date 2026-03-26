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
exports.TuitionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const student_entity_1 = require("../students/entities/student.entity");
const student_tuition_plan_entity_1 = require("./entities/student-tuition-plan.entity");
const tuition_payment_entity_1 = require("./entities/tuition-payment.entity");
let TuitionService = class TuitionService {
    planRepository;
    paymentRepository;
    studentRepository;
    constructor(planRepository, paymentRepository, studentRepository) {
        this.planRepository = planRepository;
        this.paymentRepository = paymentRepository;
        this.studentRepository = studentRepository;
    }
    async assertCanAccessStudent(actor, studentId) {
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        if (actor.role === role_enum_1.Role.ADMIN) {
            return student;
        }
        if (actor.role === role_enum_1.Role.TEACHER) {
            throw new common_1.ForbiddenException();
        }
        if (actor.role === role_enum_1.Role.PARENT) {
            if (student.parentId !== actor.userId) {
                throw new common_1.ForbiddenException();
            }
            return student;
        }
        throw new common_1.ForbiddenException();
    }
    async setStudentMonthlyFee(actor, studentId, monthlyFee) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        const existing = await this.planRepository.findOne({
            where: { studentId },
        });
        if (!existing) {
            return this.planRepository.save(this.planRepository.create({ studentId, monthlyFee }));
        }
        await this.planRepository.update(existing.id, { monthlyFee });
        return this.planRepository.findOne({ where: { id: existing.id } });
    }
    async createPayment(actor, studentId, month, amount, method, note) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const student = await this.studentRepository.findOne({
            where: { id: studentId },
        });
        if (!student) {
            throw new common_1.NotFoundException('student not found');
        }
        const payment = this.paymentRepository.create({
            studentId,
            month,
            amount,
            createdById: actor.userId,
            method: method ?? null,
            note: note ?? null,
        });
        return this.paymentRepository.save(payment);
    }
    async getStudentMonthSummary(actor, studentId, month) {
        await this.assertCanAccessStudent(actor, studentId);
        const plan = await this.planRepository.findOne({ where: { studentId } });
        const due = plan ? Number(plan.monthlyFee) : 0;
        const payments = await this.paymentRepository.find({
            where: { studentId, month },
            order: { paidAt: 'DESC' },
        });
        const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
        const debt = Math.max(0, due - paid);
        return {
            studentId,
            month,
            due,
            paid,
            debt,
            status: debt === 0 ? 'paid' : 'debt',
            payments,
        };
    }
    async getParentSummary(actor, month) {
        if (actor.role !== role_enum_1.Role.PARENT) {
            throw new common_1.ForbiddenException();
        }
        const children = await this.studentRepository.find({
            where: { parentId: actor.userId },
        });
        const results = [];
        for (const c of children) {
            results.push(await this.getStudentMonthSummary(actor, c.id, month));
        }
        return results;
    }
    async adminUnpaidList(actor, month, classId) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const where = classId ? { classId } : {};
        const students = await this.studentRepository.find({
            where,
            relations: ['class', 'parent'],
        });
        const studentIds = students.map((s) => s.id);
        if (studentIds.length === 0) {
            return [];
        }
        const plans = await this.planRepository
            .createQueryBuilder('plan')
            .where('plan.studentId IN (:...ids)', { ids: studentIds })
            .getMany();
        const planByStudent = new Map(plans.map((p) => [p.studentId, Number(p.monthlyFee)]));
        const payments = await this.paymentRepository
            .createQueryBuilder('payment')
            .select('payment.studentId', 'studentId')
            .addSelect('SUM(payment.amount)', 'paid')
            .where('payment.studentId IN (:...ids)', { ids: studentIds })
            .andWhere('payment.month = :month', { month })
            .groupBy('payment.studentId')
            .getRawMany();
        const paidByStudent = new Map(payments.map((p) => [p.studentId, Number(p.paid)]));
        return students
            .map((s) => {
            const due = planByStudent.get(s.id) ?? 0;
            const paid = paidByStudent.get(s.id) ?? 0;
            const debt = Math.max(0, due - paid);
            return {
                studentId: s.id,
                studentName: s.name,
                classId: s.classId ?? null,
                className: s.class?.name ?? null,
                parentId: s.parentId ?? null,
                parentEmail: s.parent?.email ?? null,
                month,
                due,
                paid,
                debt,
                status: debt === 0 ? 'paid' : 'debt',
            };
        })
            .filter((x) => x.debt > 0);
    }
};
exports.TuitionService = TuitionService;
exports.TuitionService = TuitionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(student_tuition_plan_entity_1.StudentTuitionPlan)),
    __param(1, (0, typeorm_1.InjectRepository)(tuition_payment_entity_1.TuitionPayment)),
    __param(2, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TuitionService);
//# sourceMappingURL=tuition.service.js.map