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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_assessment_dto_1 = require("./dto/create-assessment.dto");
const update_assessment_dto_1 = require("./dto/update-assessment.dto");
const assessments_service_1 = require("./assessments.service");
let AssessmentsController = class AssessmentsController {
    assessmentsService;
    constructor(assessmentsService) {
        this.assessmentsService = assessmentsService;
    }
    create(actor, dto) {
        return this.assessmentsService.create(actor, {
            studentId: dto.studentId,
            courseId: dto.courseId,
            ethicsScore: dto.ethicsScore,
            wisdomScore: dto.wisdomScore,
            willpowerScore: dto.willpowerScore,
            comments: dto.comments,
            assessmentDate: new Date(dto.assessmentDate),
        });
    }
    findByStudent(actor, studentId) {
        return this.assessmentsService.findAllByStudent(actor, studentId);
    }
    threeRoots(actor, studentId) {
        return this.assessmentsService.getThreeRootsSummary(actor, studentId);
    }
    findById(actor, id) {
        return this.assessmentsService.findById(actor, id);
    }
    update(actor, id, dto) {
        return this.assessmentsService.update(actor, id, {
            ethicsScore: dto.ethicsScore,
            wisdomScore: dto.wisdomScore,
            willpowerScore: dto.willpowerScore,
            comments: dto.comments,
            assessmentDate: dto.assessmentDate
                ? new Date(dto.assessmentDate)
                : undefined,
        });
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create assessment (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_assessment_dto_1.CreateAssessmentDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({ summary: 'List assessments of a student (role-based)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findByStudent", null);
__decorate([
    (0, common_1.Get)('student/:studentId/three-roots'),
    (0, swagger_1.ApiOperation)({ summary: 'Three-roots summary for a student (role-based)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "threeRoots", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get assessment by id (role-based)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update assessment (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_assessment_dto_1.UpdateAssessmentDto]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "update", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, swagger_1.ApiTags)('assessments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('assessments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map