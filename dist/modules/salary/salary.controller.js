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
exports.SalaryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const set_teacher_rate_dto_1 = require("./dto/set-teacher-rate.dto");
const salary_service_1 = require("./salary.service");
let SalaryController = class SalaryController {
    salaryService;
    constructor(salaryService) {
        this.salaryService = salaryService;
    }
    setRate(actor, teacherId, dto) {
        return this.salaryService.setTeacherRate(actor, teacherId, dto.shiftId, dto.amountPerSession);
    }
    listRates(actor, teacherId) {
        return this.salaryService.listTeacherRates(actor, teacherId);
    }
    teacherSalary(actor, teacherId, month) {
        return this.salaryService.getTeacherSalaryByMonth(actor, teacherId, month);
    }
    mySalary(actor, month) {
        return this.salaryService.getTeacherSalaryByMonth(actor, actor.userId, month);
    }
};
exports.SalaryController = SalaryController;
__decorate([
    (0, common_1.Post)('teachers/:teacherId/rates'),
    (0, swagger_1.ApiOperation)({ summary: 'Set teacher rate per shift (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teacherId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, set_teacher_rate_dto_1.SetTeacherRateDto]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "setRate", null);
__decorate([
    (0, common_1.Get)('teachers/:teacherId/rates'),
    (0, swagger_1.ApiOperation)({ summary: 'List teacher rates (admin/teacher self)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teacherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "listRates", null);
__decorate([
    (0, common_1.Get)('teachers/:teacherId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Teacher salary report by month (admin/teacher self)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teacherId')),
    __param(2, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "teacherSalary", null);
__decorate([
    (0, common_1.Get)('teachers/me'),
    (0, swagger_1.ApiOperation)({ summary: 'My salary report by month (teacher)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('month')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SalaryController.prototype, "mySalary", null);
exports.SalaryController = SalaryController = __decorate([
    (0, swagger_1.ApiTags)('salary'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('salary'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [salary_service_1.SalaryService])
], SalaryController);
//# sourceMappingURL=salary.controller.js.map