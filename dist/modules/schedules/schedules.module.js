"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_entity_1 = require("../classes/entities/class.entity");
const shift_entity_1 = require("../shifts/entities/shift.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const class_schedule_entity_1 = require("./entities/class-schedule.entity");
const schedules_controller_1 = require("./schedules.controller");
const schedules_service_1 = require("./schedules.service");
let SchedulesModule = class SchedulesModule {
};
exports.SchedulesModule = SchedulesModule;
exports.SchedulesModule = SchedulesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([class_schedule_entity_1.ClassSchedule, class_entity_1.Class, student_entity_1.Student, user_entity_1.User, shift_entity_1.Shift]),
        ],
        controllers: [schedules_controller_1.SchedulesController],
        providers: [schedules_service_1.SchedulesService],
    })
], SchedulesModule);
//# sourceMappingURL=schedules.module.js.map