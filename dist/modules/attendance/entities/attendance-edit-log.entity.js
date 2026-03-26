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
exports.AttendanceEditLog = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const attendance_session_entity_1 = require("./attendance-session.entity");
let AttendanceEditLog = class AttendanceEditLog {
    id;
    session;
    sessionId;
    editor;
    editorId;
    reason;
    before;
    after;
    createdAt;
};
exports.AttendanceEditLog = AttendanceEditLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AttendanceEditLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => attendance_session_entity_1.AttendanceSession),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", attendance_session_entity_1.AttendanceSession)
], AttendanceEditLog.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id' }),
    __metadata("design:type", String)
], AttendanceEditLog.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'editor_id' }),
    __metadata("design:type", user_entity_1.User)
], AttendanceEditLog.prototype, "editor", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'editor_id' }),
    __metadata("design:type", String)
], AttendanceEditLog.prototype, "editorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], AttendanceEditLog.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], AttendanceEditLog.prototype, "before", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    __metadata("design:type", Object)
], AttendanceEditLog.prototype, "after", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], AttendanceEditLog.prototype, "createdAt", void 0);
exports.AttendanceEditLog = AttendanceEditLog = __decorate([
    (0, typeorm_1.Entity)('attendance_edit_logs')
], AttendanceEditLog);
//# sourceMappingURL=attendance-edit-log.entity.js.map