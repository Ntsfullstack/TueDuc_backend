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
exports.TuitionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_tuition_payment_dto_1 = require("./dto/create-tuition-payment.dto");
const set_student_tuition_dto_1 = require("./dto/set-student-tuition.dto");
const tuition_service_1 = require("./tuition.service");
let TuitionController = class TuitionController {
    tuitionService;
    constructor(tuitionService) {
        this.tuitionService = tuitionService;
    }
    setPlan(actor, studentId, dto) {
        return this.tuitionService.setStudentMonthlyFee(actor, studentId, dto.monthlyFee);
    }
    createPayment(actor, studentId, dto) {
        return this.tuitionService.createPayment(actor, studentId, dto.month, dto.amount, dto.method, dto.note);
    }
    studentMonth(actor, studentId, month) {
        return this.tuitionService.getStudentMonthSummary(actor, studentId, month);
    }
    parentMonth(actor, month) {
        return this.tuitionService.getParentSummary(actor, month);
    }
    unpaid(actor, month, classId) {
        return this.tuitionService.adminUnpaidList(actor, month, classId);
    }
    remind(actor, month, classId) {
        return this.tuitionService.adminUnpaidList(actor, month, classId);
    }
};
exports.TuitionController = TuitionController;
__decorate([
    (0, common_1.Post)('students/:studentId/plan'),
    (0, swagger_1.ApiOperation)({ summary: 'Set monthly tuition fee for a student (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, set_student_tuition_dto_1.SetStudentTuitionDto]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "setPlan", null);
__decorate([
    (0, common_1.Post)('students/:studentId/payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Create tuition payment record (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_tuition_payment_dto_1.CreateTuitionPaymentDto]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('students/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tuition summary of a student by month (admin/parent)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "studentMonth", null);
__decorate([
    (0, common_1.Get)('parent/me'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get tuition summary for all my children by month (parent)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "parentMonth", null);
__decorate([
    (0, common_1.Get)('unpaid'),
    (0, swagger_1.ApiOperation)({ summary: 'List unpaid students by month (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "unpaid", null);
__decorate([
    (0, common_1.Post)('unpaid/remind'),
    (0, swagger_1.ApiOperation)({
        summary: 'Generate reminder list for unpaid students (admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __param(2, (0, common_1.Query)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], TuitionController.prototype, "remind", null);
exports.TuitionController = TuitionController = __decorate([
    (0, swagger_1.ApiTags)('tuition'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('tuition'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [tuition_service_1.TuitionService])
], TuitionController);
//# sourceMappingURL=tuition.controller.js.map