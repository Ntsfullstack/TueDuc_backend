"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const attendance_record_entity_1 = require("../attendance/entities/attendance-record.entity");
const attendance_session_entity_1 = require("../attendance/entities/attendance-session.entity");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const student_tuition_plan_entity_1 = require("../tuition/entities/student-tuition-plan.entity");
const tuition_payment_entity_1 = require("../tuition/entities/tuition-payment.entity");
const admin_controller_1 = require("./admin.controller");
const admin_service_1 = require("./admin.service");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                class_entity_1.Class,
                student_entity_1.Student,
                user_entity_1.User,
                attendance_session_entity_1.AttendanceSession,
                attendance_record_entity_1.AttendanceRecord,
                student_tuition_plan_entity_1.StudentTuitionPlan,
                tuition_payment_entity_1.TuitionPayment,
            ]),
        ],
        controllers: [admin_controller_1.AdminController],
        providers: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map