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
exports.UpdateClassDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_entity_1 = require("../entities/class.entity");
class UpdateClassDto {
    name;
    grade;
    academicYear;
    homeroomTeacherId;
    status;
    maxStudents;
}
exports.UpdateClassDto = UpdateClassDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Lớp 10A1' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '10' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "grade", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-2027' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "academicYear", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-teacher' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "homeroomTeacherId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: class_entity_1.ClassStatus, example: class_entity_1.ClassStatus.OPEN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(class_entity_1.ClassStatus),
    __metadata("design:type", String)
], UpdateClassDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateClassDto.prototype, "maxStudents", void 0);
//# sourceMappingURL=update-class.dto.js.map