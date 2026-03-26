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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const attendance_service_1 = require("./attendance.service");
const mark_attendance_dto_1 = require("./dto/mark-attendance.dto");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
let AttendanceController = class AttendanceController {
    attendanceService;
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    mark(actor, dto) {
        return this.attendanceService.mark(actor, dto);
    }
    getByClassDate(actor, classId, date, shiftId) {
        return this.attendanceService.getByClassDate(actor, classId, date, shiftId);
    }
    getByStudent(actor, studentId) {
        return this.attendanceService.getByStudent(actor, studentId);
    }
    adminSessions(actor, date, shiftId) {
        return this.attendanceService.adminListSessions(actor, date, shiftId);
    }
    adminUpdateSession(actor, sessionId, dto) {
        return this.attendanceService.adminUpdateSession(actor, sessionId, dto);
    }
    adminEditLogs(actor, sessionId) {
        return this.attendanceService.adminEditLogs(actor, sessionId);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)('mark'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark attendance for a class/day (teacher/admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, mark_attendance_dto_1.MarkAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "mark", null);
__decorate([
    (0, common_1.Get)('class/:classId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance session by class and date (teacher/admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('classId')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getByClassDate", null);
__decorate([
    (0, common_1.Get)('student/:studentId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get attendance records by student (parent/teacher/admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('studentId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "getByStudent", null);
__decorate([
    (0, common_1.Get)('admin/sessions'),
    (0, swagger_1.ApiOperation)({ summary: 'List attendance sessions by day/shift (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('date')),
    __param(2, (0, common_1.Query)('shiftId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "adminSessions", null);
__decorate([
    (0, common_1.Patch)('sessions/:sessionId'),
    (0, swagger_1.ApiOperation)({
        summary: 'Admin edit attendance session and save audit log (admin)',
    }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "adminUpdateSession", null);
__decorate([
    (0, common_1.Get)('sessions/:sessionId/edits'),
    (0, swagger_1.ApiOperation)({ summary: 'Get attendance edit logs (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "adminEditLogs", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, swagger_1.ApiTags)('attendance'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('attendance'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map