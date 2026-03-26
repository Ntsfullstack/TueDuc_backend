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
exports.TuitionPayment = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let TuitionPayment = class TuitionPayment {
    id;
    student;
    studentId;
    month;
    amount;
    paidAt;
    createdBy;
    createdById;
    method;
    note;
    createdAt;
    updatedAt;
};
exports.TuitionPayment = TuitionPayment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TuitionPayment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], TuitionPayment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], TuitionPayment.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'char', length: 7 }),
    __metadata("design:type", String)
], TuitionPayment.prototype, "month", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 0 }),
    __metadata("design:type", Number)
], TuitionPayment.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_at', type: 'timestamptz', default: () => 'now()' }),
    __metadata("design:type", Date)
], TuitionPayment.prototype, "paidAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], TuitionPayment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], TuitionPayment.prototype, "createdById", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: true }),
    __metadata("design:type", Object)
], TuitionPayment.prototype, "method", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], TuitionPayment.prototype, "note", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], TuitionPayment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], TuitionPayment.prototype, "updatedAt", void 0);
exports.TuitionPayment = TuitionPayment = __decorate([
    (0, typeorm_1.Entity)('tuition_payments')
], TuitionPayment);
//# sourceMappingURL=tuition-payment.entity.js.map