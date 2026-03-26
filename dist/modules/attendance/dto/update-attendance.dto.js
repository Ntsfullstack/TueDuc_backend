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
exports.UpdateAttendanceDto = exports.AttendanceRecordPatchDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const attendance_record_entity_1 = require("../entities/attendance-record.entity");
class AttendanceRecordPatchDto {
    studentId;
    status;
    note;
}
exports.AttendanceRecordPatchDto = AttendanceRecordPatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-student' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], AttendanceRecordPatchDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: attendance_record_entity_1.AttendanceStatus }),
    (0, class_validator_1.IsEnum)(attendance_record_entity_1.AttendanceStatus),
    __metadata("design:type", String)
], AttendanceRecordPatchDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AttendanceRecordPatchDto.prototype, "note", void 0);
class UpdateAttendanceDto {
    reason;
    records;
}
exports.UpdateAttendanceDto = UpdateAttendanceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateAttendanceDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [AttendanceRecordPatchDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AttendanceRecordPatchDto),
    __metadata("design:type", Array)
], UpdateAttendanceDto.prototype, "records", void 0);
//# sourceMappingURL=update-attendance.dto.js.map