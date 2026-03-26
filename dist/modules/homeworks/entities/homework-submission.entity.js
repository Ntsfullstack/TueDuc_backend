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
exports.HomeworkSubmission = exports.HomeworkSubmissionStatus = void 0;
const typeorm_1 = require("typeorm");
const student_entity_1 = require("../../students/entities/student.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const homework_entity_1 = require("./homework.entity");
var HomeworkSubmissionStatus;
(function (HomeworkSubmissionStatus) {
    HomeworkSubmissionStatus["SUBMITTED"] = "submitted";
    HomeworkSubmissionStatus["GRADED"] = "graded";
})(HomeworkSubmissionStatus || (exports.HomeworkSubmissionStatus = HomeworkSubmissionStatus = {}));
let HomeworkSubmission = class HomeworkSubmission {
    id;
    homework;
    homeworkId;
    student;
    studentId;
    parent;
    parentId;
    status;
    quizAnswers;
    attachments;
    score;
    feedback;
    submittedAt;
    createdAt;
    updatedAt;
};
exports.HomeworkSubmission = HomeworkSubmission;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => homework_entity_1.Homework),
    (0, typeorm_1.JoinColumn)({ name: 'homework_id' }),
    __metadata("design:type", homework_entity_1.Homework)
], HomeworkSubmission.prototype, "homework", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'homework_id' }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "homeworkId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => student_entity_1.Student),
    (0, typeorm_1.JoinColumn)({ name: 'student_id' }),
    __metadata("design:type", student_entity_1.Student)
], HomeworkSubmission.prototype, "student", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_id' }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "studentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", user_entity_1.User)
], HomeworkSubmission.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id' }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: HomeworkSubmissionStatus,
        default: HomeworkSubmissionStatus.SUBMITTED,
    }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], HomeworkSubmission.prototype, "quizAnswers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], HomeworkSubmission.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 4, scale: 1, nullable: true }),
    __metadata("design:type", Object)
], HomeworkSubmission.prototype, "score", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], HomeworkSubmission.prototype, "feedback", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'submitted_at', type: 'timestamptz', default: () => 'now()' }),
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "submittedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], HomeworkSubmission.prototype, "updatedAt", void 0);
exports.HomeworkSubmission = HomeworkSubmission = __decorate([
    (0, typeorm_1.Entity)('homework_submissions'),
    (0, typeorm_1.Unique)(['homeworkId', 'studentId'])
], HomeworkSubmission);
//# sourceMappingURL=homework-submission.entity.js.map