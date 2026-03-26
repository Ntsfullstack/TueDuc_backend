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
exports.Assessment = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const course_entity_1 = require("../../courses/entities/course.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let Assessment = class Assessment {
    id;
    student;
    studentId;
    course;
    courseId;
    teacher;
    teacherId;
    ethicsScore;
    wisdomScore;
    willpowerScore;
    comments;
    assessmentDate;
    createdAt;
    updatedAt;
};
exports.Assessment = Assessment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Assessment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], Assessment.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], Assessment.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => course_entity_1.Course),
    (0, typeorm_1.JoinColumn)({ name: 'course_id' }),
    __metadata("design:type", course_entity_1.Course)
], Assessment.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'course_id' }),
    __metadata("design:type", String)
], Assessment.prototype, "courseId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Assessment.prototype, "teacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'teacher_id' }),
    __metadata("design:type", String)
], Assessment.prototype, "teacherId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'ethics_score',
        type: 'decimal',
        precision: 3,
        scale: 1,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Assessment.prototype, "ethicsScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'wisdom_score',
        type: 'decimal',
        precision: 3,
        scale: 1,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Assessment.prototype, "wisdomScore", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'willpower_score',
        type: 'decimal',
        precision: 3,
        scale: 1,
        nullable: true,
    }),
    __metadata("design:type", Number)
], Assessment.prototype, "willpowerScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Assessment.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'assessment_date', type: 'date' }),
    __metadata("design:type", Date)
], Assessment.prototype, "assessmentDate", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Assessment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Assessment.prototype, "updatedAt", void 0);
exports.Assessment = Assessment = __decorate([
    (0, typeorm_1.Entity)('assessments')
], Assessment);
//# sourceMappingURL=assessment.entity.js.map