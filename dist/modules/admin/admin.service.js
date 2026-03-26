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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const attendance_record_entity_1 = require("../attendance/entities/attendance-record.entity");
const attendance_session_entity_1 = require("../attendance/entities/attendance-session.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_tuition_plan_entity_1 = require("../tuition/entities/student-tuition-plan.entity");
const tuition_payment_entity_1 = require("../tuition/entities/tuition-payment.entity");
let AdminService = class AdminService {
    classRepository;
    studentRepository;
    userRepository;
    attendanceSessionRepository;
    attendanceRecordRepository;
    tuitionPlanRepository;
    tuitionPaymentRepository;
    constructor(classRepository, studentRepository, userRepository, attendanceSessionRepository, attendanceRecordRepository, tuitionPlanRepository, tuitionPaymentRepository) {
        this.classRepository = classRepository;
        this.studentRepository = studentRepository;
        this.userRepository = userRepository;
        this.attendanceSessionRepository = attendanceSessionRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.tuitionPlanRepository = tuitionPlanRepository;
        this.tuitionPaymentRepository = tuitionPaymentRepository;
    }
    todayDateString() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }
    currentMonthString() {
        const d = new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        return `${yyyy}-${mm}`;
    }
    async dashboard(actor, month, date) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const reportMonth = month ?? this.currentMonthString();
        const reportDate = date ?? this.todayDateString();
        const [totalClasses, totalStudents] = await Promise.all([
            this.classRepository.count(),
            this.studentRepository.count(),
        ]);
        const activeClasses = await this.classRepository.count({
            where: { status: class_entity_1.ClassStatus.OPEN, archivedAt: (0, typeorm_2.IsNull)() },
        });
        const totalTeachers = await this.userRepository.count({
            where: { role: role_enum_1.Role.TEACHER, isActive: true },
        });
        const sessionsToday = await this.attendanceSessionRepository.count({
            where: { date: reportDate },
        });
        const attendanceRaw = await this.attendanceRecordRepository
            .createQueryBuilder('record')
            .leftJoin('record.session', 'session')
            .select('COUNT(record.id)', 'total')
            .addSelect(`SUM(CASE WHEN record.status = :present THEN 1 ELSE 0 END)`, 'present')
            .where('session.date = :date', { date: reportDate })
            .setParameter('present', attendance_record_entity_1.AttendanceStatus.PRESENT)
            .getRawOne();
        const totalAttendance = Number(attendanceRaw?.total ?? 0);
        const presentAttendance = Number(attendanceRaw?.present ?? 0);
        const attendanceRate = totalAttendance > 0 ? presentAttendance / totalAttendance : 0;
        const students = await this.studentRepository.find();
        const studentIds = students.map((s) => s.id);
        const plans = studentIds.length
            ? await this.tuitionPlanRepository
                .createQueryBuilder('plan')
                .where('plan.studentId IN (:...ids)', { ids: studentIds })
                .getMany()
            : [];
        const planByStudent = new Map(plans.map((p) => [p.studentId, Number(p.monthlyFee)]));
        const tuitionDue = students.reduce((sum, s) => sum + (planByStudent.get(s.id) ?? 0), 0);
        const tuitionPaidRaw = await this.tuitionPaymentRepository
            .createQueryBuilder('payment')
            .select('COALESCE(SUM(payment.amount), 0)', 'paid')
            .where('payment.month = :month', { month: reportMonth })
            .getRawOne();
        const tuitionPaid = Number(tuitionPaidRaw?.paid ?? 0);
        const tuitionDebt = Math.max(0, tuitionDue - tuitionPaid);
        return {
            totals: {
                classes: totalClasses,
                students: totalStudents,
                teachers: totalTeachers,
                activeClasses,
            },
            attendance: {
                date: reportDate,
                sessions: sessionsToday,
                totalRecords: totalAttendance,
                presentRecords: presentAttendance,
                rate: attendanceRate,
            },
            tuition: {
                month: reportMonth,
                due: tuitionDue,
                paid: tuitionPaid,
                debt: tuitionDebt,
            },
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(class_entity_1.Class)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(attendance_session_entity_1.AttendanceSession)),
    __param(4, (0, typeorm_1.InjectRepository)(attendance_record_entity_1.AttendanceRecord)),
    __param(5, (0, typeorm_1.InjectRepository)(student_tuition_plan_entity_1.StudentTuitionPlan)),
    __param(6, (0, typeorm_1.InjectRepository)(tuition_payment_entity_1.TuitionPayment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminService);
//# sourceMappingURL=admin.service.js.map