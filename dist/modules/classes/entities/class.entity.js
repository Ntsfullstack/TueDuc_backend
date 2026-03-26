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
exports.Class = exports.ClassStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const student_entity_1 = require("../../students/entities/student.entity");
var ClassStatus;
(function (ClassStatus) {
    ClassStatus["OPEN"] = "open";
    ClassStatus["CLOSED"] = "closed";
    ClassStatus["PAUSED"] = "paused";
})(ClassStatus || (exports.ClassStatus = ClassStatus = {}));
let Class = class Class {
    id;
    name;
    grade;
    academicYear;
    status;
    maxStudents;
    archivedAt;
    clonedFromId;
    homeroomTeacher;
    homeroomTeacherId;
    students;
    createdAt;
    updatedAt;
};
exports.Class = Class;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Class.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Class.prototype, "grade", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'academic_year' }),
    __metadata("design:type", String)
], Class.prototype, "academicYear", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ClassStatus, default: ClassStatus.OPEN }),
    __metadata("design:type", String)
], Class.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'max_students', type: 'int', nullable: true }),
    __metadata("design:type", Object)
], Class.prototype, "maxStudents", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'archived_at', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Class.prototype, "archivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cloned_from_id', type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Class.prototype, "clonedFromId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'homeroom_teacher_id' }),
    __metadata("design:type", user_entity_1.User)
], Class.prototype, "homeroomTeacher", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'homeroom_teacher_id', nullable: true }),
    __metadata("design:type", String)
], Class.prototype, "homeroomTeacherId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => student_entity_1.Student, (student) => student.class),
    __metadata("design:type", Array)
], Class.prototype, "students", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Class.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Class.prototype, "updatedAt", void 0);
exports.Class = Class = __decorate([
    (0, typeorm_1.Entity)('classes')
], Class);
//# sourceMappingURL=class.entity.js.map