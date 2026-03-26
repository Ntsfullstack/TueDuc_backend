"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_entity_1 = require("../classes/entities/class.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const student_entity_1 = require("../students/entities/student.entity");
const attendance_controller_1 = require("./attendance.controller");
const attendance_service_1 = require("./attendance.service");
const attendance_edit_log_entity_1 = require("./entities/attendance-edit-log.entity");
const attendance_record_entity_1 = require("./entities/attendance-record.entity");
const attendance_session_entity_1 = require("./entities/attendance-session.entity");
let AttendanceModule = class AttendanceModule {
};
exports.AttendanceModule = AttendanceModule;
exports.AttendanceModule = AttendanceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                attendance_session_entity_1.AttendanceSession,
                attendance_record_entity_1.AttendanceRecord,
                attendance_edit_log_entity_1.AttendanceEditLog,
                class_entity_1.Class,
                student_entity_1.Student,
                shift_entity_1.Shift,
            ]),
        ],
        controllers: [attendance_controller_1.AttendanceController],
        providers: [attendance_service_1.AttendanceService],
    })
], AttendanceModule);
//# sourceMappingURL=attendance.module.js.map