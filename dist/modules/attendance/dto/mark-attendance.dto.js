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
exports.MarkAttendanceDto = exports.AttendanceRecordInputDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const attendance_record_entity_1 = require("../entities/attendance-record.entity");
class AttendanceRecordInputDto {
    studentId;
    status;
    note;
}
exports.AttendanceRecordInputDto = AttendanceRecordInputDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-student' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: attendance_record_entity_1.AttendanceStatus, example: attendance_record_entity_1.AttendanceStatus.PRESENT }),
    (0, class_validator_1.IsEnum)(attendance_record_entity_1.AttendanceStatus),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceRecordInputDto.prototype, "note", void 0);
class MarkAttendanceDto {
    classId;
    date;
    shiftId;
    records;
}
exports.MarkAttendanceDto = MarkAttendanceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-class' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MarkAttendanceDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-24' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], MarkAttendanceDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-shift' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], MarkAttendanceDto.prototype, "shiftId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AttendanceRecordInputDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AttendanceRecordInputDto),
    __metadata("design:type", Array)
], MarkAttendanceDto.prototype, "records", void 0);
//# sourceMappingURL=mark-attendance.dto.js.map