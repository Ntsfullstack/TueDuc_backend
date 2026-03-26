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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentTuitionPlan = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
let StudentTuitionPlan = class StudentTuitionPlan {
    id;
    student;
    studentId;
    monthlyFee;
    createdAt;
    updatedAt;
};
exports.StudentTuitionPlan = StudentTuitionPlan;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StudentTuitionPlan.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], StudentTuitionPlan.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], StudentTuitionPlan.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'monthly_fee', type: 'decimal', precision: 12, scale: 0 }),
    __metadata("design:type", Number)
], StudentTuitionPlan.prototype, "monthlyFee", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StudentTuitionPlan.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StudentTuitionPlan.prototype, "updatedAt", void 0);
exports.StudentTuitionPlan = StudentTuitionPlan = __decorate([
    (0, typeorm_1.Entity)('student_tuition_plans'),
    (0, typeorm_1.Unique)(['studentId'])
], StudentTuitionPlan);
//# sourceMappingURL=student-tuition-plan.entity.js.map