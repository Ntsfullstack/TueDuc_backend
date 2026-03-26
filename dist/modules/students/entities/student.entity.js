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
exports.Student = exports.StudentStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const class_entity_1 = require("../../classes/entities/class.entity");
var StudentStatus;
(function (StudentStatus) {
    StudentStatus["ACTIVE"] = "active";
    StudentStatus["PAUSED"] = "paused";
    StudentStatus["STOPPED"] = "stopped";
})(StudentStatus || (exports.StudentStatus = StudentStatus = {}));
let Student = class Student {
    id;
    name;
    dateOfBirth;
    gender;
    status;
    studentCode;
    parent;
    parentId;
    class;
    classId;
    createdAt;
    updatedAt;
};
exports.Student = Student;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Student.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Student.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'date_of_birth', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Student.prototype, "dateOfBirth", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: StudentStatus, default: StudentStatus.ACTIVE }),
    __metadata("design:type", String)
], Student.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'student_code', unique: true }),
    __metadata("design:type", String)
], Student.prototype, "studentCode", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", user_entity_1.User)
], Student.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => class_entity_1.Class, (classEntity) => classEntity.students),
    (0, typeorm_1.JoinColumn)({ name: 'class_id' }),
    __metadata("design:type", class_entity_1.Class)
], Student.prototype, "class", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'class_id', nullable: true }),
    __metadata("design:type", String)
], Student.prototype, "classId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Student.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Student.prototype, "updatedAt", void 0);
exports.Student = Student = __decorate([
    (0, typeorm_1.Entity)('students')
], Student);
//# sourceMappingURL=student.entity.js.map