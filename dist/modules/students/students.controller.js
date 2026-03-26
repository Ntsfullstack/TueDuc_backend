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
exports.StudentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_student_dto_1 = require("./dto/create-student.dto");
const claim_student_dto_1 = require("./dto/claim-student.dto");
const link_parent_dto_1 = require("./dto/link-parent.dto");
const update_student_dto_1 = require("./dto/update-student.dto");
const students_service_1 = require("./students.service");
class TransferStudentDto {
    classId;
}
let StudentsController = class StudentsController {
    studentsService;
    constructor(studentsService) {
        this.studentsService = studentsService;
    }
    my(actor) {
        return this.studentsService.findMyChildren(actor);
    }
    findAll(actor) {
        return this.studentsService.findAll(actor);
    }
    findById(actor, id) {
        return this.studentsService.findById(actor, id);
    }
    create(actor, dto) {
        return this.studentsService.create(actor, dto);
    }
    update(actor, id, dto) {
        return this.studentsService.update(actor, id, dto);
    }
    transfer(actor, id, dto) {
        return this.studentsService.transfer(actor, id, dto.classId);
    }
    remove(actor, id) {
        return this.studentsService.remove(actor, id);
    }
    linkParent(actor, id, dto) {
        return this.studentsService.linkParent(actor, id, dto.parentId);
    }
    unlinkParent(actor, id) {
        return this.studentsService.unlinkParent(actor, id);
    }
    claim(actor, dto) {
        return this.studentsService.claimStudent(actor, dto.studentCode);
    }
    regenerateCode(actor, id) {
        return this.studentsService.regenerateCode(actor, id);
    }
};
exports.StudentsController = StudentsController;
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: 'List my children (parent only)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "my", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List students (admin/teacher)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get student by id (role-based)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "findById", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create student (admin/teacher)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_student_dto_1.CreateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update student (admin/teacher)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_student_dto_1.UpdateStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/transfer'),
    (0, swagger_1.ApiOperation)({ summary: 'Transfer student to another class (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, TransferStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "transfer", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete student (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/link-parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Link a parent account to a student (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, link_parent_dto_1.LinkParentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "linkParent", null);
__decorate([
    (0, common_1.Patch)(':id/unlink-parent'),
    (0, swagger_1.ApiOperation)({ summary: 'Unlink parent from a student (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "unlinkParent", null);
__decorate([
    (0, common_1.Post)('claim'),
    (0, swagger_1.ApiOperation)({
        summary: 'Parent claims a child by student code (parent only)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, claim_student_dto_1.ClaimStudentDto]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "claim", null);
__decorate([
    (0, common_1.Post)(':id/regenerate-code'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin regenerates student code (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], StudentsController.prototype, "regenerateCode", null);
exports.StudentsController = StudentsController = __decorate([
    (0, swagger_1.ApiTags)('students'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('students'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [students_service_1.StudentsService])
], StudentsController);
//# sourceMappingURL=students.controller.js.map