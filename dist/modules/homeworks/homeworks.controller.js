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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworksController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const swagger_1 = require("@nestjs/swagger");
const path_1 = require("path");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_homework_dto_1 = require("./dto/create-homework.dto");
const grade_submission_dto_1 = require("./dto/grade-submission.dto");
const submit_essay_dto_1 = require("./dto/submit-essay.dto");
const submit_quiz_dto_1 = require("./dto/submit-quiz.dto");
const update_homework_dto_1 = require("./dto/update-homework.dto");
const homeworks_service_1 = require("./homeworks.service");
let HomeworksController = class HomeworksController {
    homeworksService;
    constructor(homeworksService) {
        this.homeworksService = homeworksService;
    }
    list(actor, studentId) {
        return this.homeworksService.list(actor, studentId);
    }
    create(actor, dto) {
        return this.homeworksService.create(actor, dto);
    }
    findById(actor, id) {
        return this.homeworksService.findById(actor, id);
    }
    update(actor, id, dto) {
        return this.homeworksService.update(actor, id, dto);
    }
    status(actor, id) {
        return this.homeworksService.homeworkStatus(actor, id);
    }
    submitQuiz(actor, id, dto) {
        return this.homeworksService.submitQuiz(actor, id, dto);
    }
    submitEssay(actor, id, dto, files) {
        const paths = (files || []).map((f) => `/uploads/${f.filename}`);
        return this.homeworksService.submitEssay(actor, id, dto.studentId, paths);
    }
    submissions(actor, id) {
        return this.homeworksService.listSubmissions(actor, id);
    }
    grade(actor, submissionId, dto) {
        return this.homeworksService.gradeSubmission(actor, submissionId, dto);
    }
};
exports.HomeworksController = HomeworksController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List homeworks (admin/teacher/parent)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create homework (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_homework_dto_1.CreateHomeworkDto]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get homework by id (role-based)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update homework (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_homework_dto_1.UpdateHomeworkDto]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "update", null);
__decorate([
    (0, common_1.Get)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Homework completion status by student (teacher/admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "status", null);
__decorate([
    (0, common_1.Post)(':id/submissions/quiz'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit quiz homework (parent)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, submit_quiz_dto_1.SubmitQuizDto]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "submitQuiz", null);
__decorate([
    (0, common_1.Post)(':id/submissions/essay'),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit essay homework with photo attachments (parent)',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 10, {
        storage: (0, multer_1.diskStorage)({
            destination: 'uploads',
            filename: (_req, file, cb) => {
                const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
                cb(null, `${unique}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, submit_essay_dto_1.SubmitEssayDto,
        Array]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "submitEssay", null);
__decorate([
    (0, common_1.Get)(':id/submissions'),
    (0, swagger_1.ApiOperation)({ summary: 'List submissions of a homework (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "submissions", null);
__decorate([
    (0, common_1.Patch)('submissions/:submissionId/grade'),
    (0, swagger_1.ApiOperation)({ summary: 'Grade a submission (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('submissionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, grade_submission_dto_1.GradeSubmissionDto]),
    __metadata("design:returntype", void 0)
], HomeworksController.prototype, "grade", null);
exports.HomeworksController = HomeworksController = __decorate([
    (0, swagger_1.ApiTags)('homeworks'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('homeworks'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [homeworks_service_1.HomeworksService])
], HomeworksController);
//# sourceMappingURL=homeworks.controller.js.map