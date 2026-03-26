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
exports.CreateHomeworkDto = exports.QuizQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const homework_entity_1 = require("../entities/homework.entity");
class QuizQuestionDto {
    prompt;
    options;
    correctIndex;
}
exports.QuizQuestionDto = QuizQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Câu hỏi 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], QuizQuestionDto.prototype, "prompt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['A', 'B', 'C', 'D'] }),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], QuizQuestionDto.prototype, "options", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: '0-based index of correct option' }),
    __metadata("design:type", Number)
], QuizQuestionDto.prototype, "correctIndex", void 0);
class CreateHomeworkDto {
    title;
    description;
    type;
    dueAt;
    classId;
    targetScope;
    studentIds;
    quizQuestions;
    teacherId;
}
exports.CreateHomeworkDto = CreateHomeworkDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Bài tập tuần 1' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: homework_entity_1.HomeworkType, example: homework_entity_1.HomeworkType.QUIZ }),
    (0, class_validator_1.IsEnum)(homework_entity_1.HomeworkType),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, example: '2026-03-30T12:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "dueAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-class' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "classId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: homework_entity_1.HomeworkTargetScope,
        example: homework_entity_1.HomeworkTargetScope.CLASS,
    }),
    (0, class_validator_1.IsEnum)(homework_entity_1.HomeworkTargetScope),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "targetScope", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: ['uuid-student-1', 'uuid-student-2'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    __metadata("design:type", Array)
], CreateHomeworkDto.prototype, "studentIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, type: [QuizQuestionDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuizQuestionDto),
    __metadata("design:type", Array)
], CreateHomeworkDto.prototype, "quizQuestions", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        example: 'uuid-teacher',
        description: 'Admin only',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateHomeworkDto.prototype, "teacherId", void 0);
//# sourceMappingURL=create-homework.dto.js.map