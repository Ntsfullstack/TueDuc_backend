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
exports.HomeworkTarget = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const homework_entity_1 = require("./homework.entity");
let HomeworkTarget = class HomeworkTarget {
    id;
    homework;
    homeworkId;
    student;
    studentId;
    createdAt;
};
exports.HomeworkTarget = HomeworkTarget;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HomeworkTarget.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => homework_entity_1.Homework, (h) => h.targets),
    (0, typeorm_1.JoinColumn)({ name: 'homework_id' }),
    __metadata("design:type", homework_entity_1.Homework)
], HomeworkTarget.prototype, "homework", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'homework_id' }),
    __metadata("design:type", String)
], HomeworkTarget.prototype, "homeworkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], HomeworkTarget.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], HomeworkTarget.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HomeworkTarget.prototype, "createdAt", void 0);
exports.HomeworkTarget = HomeworkTarget = __decorate([
    (0, typeorm_1.Entity)('homework_targets'),
    (0, typeorm_1.Unique)(['homeworkId', 'studentId'])
], HomeworkTarget);
//# sourceMappingURL=homework-target.entity.js.map