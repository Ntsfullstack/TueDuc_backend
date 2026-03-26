"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalaryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_schedule_entity_1 = require("../schedules/entities/class-schedule.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const user_entity_1 = require("../users/entities/user.entity");
const salary_controller_1 = require("./salary.controller");
const salary_service_1 = require("./salary.service");
const teacher_salary_rate_entity_1 = require("./entities/teacher-salary-rate.entity");
let SalaryModule = class SalaryModule {
};
exports.SalaryModule = SalaryModule;
exports.SalaryModule = SalaryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([teacher_salary_rate_entity_1.TeacherSalaryRate, class_schedule_entity_1.ClassSchedule, shift_entity_1.Shift, user_entity_1.User]),
        ],
        controllers: [salary_controller_1.SalaryController],
        providers: [salary_service_1.SalaryService],
    })
], SalaryModule);
//# sourceMappingURL=salary.module.js.map