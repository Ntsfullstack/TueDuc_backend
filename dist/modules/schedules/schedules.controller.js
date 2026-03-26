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
exports.SchedulesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_class_schedule_dto_1 = require("./dto/create-class-schedule.dto");
const schedules_service_1 = require("./schedules.service");
let SchedulesController = class SchedulesController {
    schedulesService;
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }
    createClassSchedule(actor, dto) {
        return this.schedulesService.createClassSchedule(actor, dto);
    }
    listByClass(actor, classId) {
        return this.schedulesService.listByClass(actor, classId);
    }
    studentSchedule(actor, studentId, date) {
        return this.schedulesService.getStudentScheduleByDate(actor, studentId, date);
    }
    teacherSchedule(actor, date) {
        return this.schedulesService.getTeacherScheduleByDate(actor, date);
    }
    teacherScheduleById(actor, teacherId, date) {
        return this.schedulesService.getTeacherScheduleByDateForTeacher(actor, teacherId, date);
    }
    centerWeek(actor, start) {
        return this.schedulesService.getCenterScheduleWeek(actor, start);
    }
};
exports.SchedulesController = SchedulesController;
__decorate([
    (0, common_1.Post)('classes'),
    (0, swagger_1.ApiOperation)({ summary: 'Create class schedule (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_class_schedule_dto_1.CreateClassScheduleDto]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "createClassSchedule", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({ summary: 'List schedules by class (admin/teacher)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('classId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "listByClass", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get student schedule by date (parent/teacher/admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "studentSchedule", null);
__decorate([
    (0, common_1.Get)('teacher/me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get teacher schedule by date (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "teacherSchedule", null);
__decorate([
    (0, common_1.Get)('teacher/:teacherId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get teacher schedule by date (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('teacherId')),
    __param(2, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "teacherScheduleById", null);
__decorate([
    (0, common_1.Get)('center/week'),
    (0, swagger_1.ApiOperation)({ summary: 'Get center schedule for a week (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('start')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SchedulesController.prototype, "centerWeek", null);
exports.SchedulesController = SchedulesController = __decorate([
    (0, swagger_1.ApiTags)('schedules'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('schedules'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [schedules_service_1.SchedulesService])
], SchedulesController);
//# sourceMappingURL=schedules.controller.js.map