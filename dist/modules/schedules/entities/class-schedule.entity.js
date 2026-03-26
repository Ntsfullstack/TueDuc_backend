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
exports.ClassSchedule = void 0;
const typeorm_1 = require("typeorm");
const class_entity_1 = require("../../classes/entities/class.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const shift_entity_1 = require("../../shifts/entities/shift.entity");
let ClassSchedule = class ClassSchedule {
    id;
    class;
    classId;
    weekday;
    shift;
    shiftId;
    teacher;
    teacherId;
    createdAt;
    updatedAt;
};
exports.ClassSchedule = ClassSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ClassSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], ClassSchedule.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'class_id' }),
    __metadata("design:type", String)
], ClassSchedule.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], ClassSchedule.prototype, "weekday", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => shift_entity_1.Shift),
    (0, typeorm_1.JoinColumn)({ name: 'shift_id' }),
    __metadata("design:type", shift_entity_1.Shift)
], ClassSchedule.prototype, "shift", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shift_id' }),
    __metadata("design:type", String)
], ClassSchedule.prototype, "shiftId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], ClassSchedule.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacher_id' }),
    __metadata("design:type", String)
], ClassSchedule.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], ClassSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], ClassSchedule.prototype, "updatedAt", void 0);
exports.ClassSchedule = ClassSchedule = __decorate([
    (0, typeorm_1.Entity)('class_schedules'),
    (0, typeorm_1.Unique)(['classId', 'weekday', 'shiftId'])
], ClassSchedule);
//# sourceMappingURL=class-schedule.entity.js.map