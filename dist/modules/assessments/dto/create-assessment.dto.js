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
exports.CreateAssessmentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateAssessmentDto {
    studentId;
    courseId;
    ethicsScore;
    wisdomScore;
    willpowerScore;
    comments;
    assessmentDate;
}
exports.CreateAssessmentDto = CreateAssessmentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-student' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "studentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-course' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "courseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8.5, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "ethicsScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 9.0, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "wisdomScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 7.5, required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateAssessmentDto.prototype, "willpowerScore", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nhận xét...', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "comments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-24' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateAssessmentDto.prototype, "assessmentDate", void 0);
//# sourceMappingURL=create-assessment.dto.js.map