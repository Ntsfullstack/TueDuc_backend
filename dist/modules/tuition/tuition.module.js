"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TuitionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const student_entity_1 = require("../students/entities/student.entity");
const student_tuition_plan_entity_1 = require("./entities/student-tuition-plan.entity");
const tuition_payment_entity_1 = require("./entities/tuition-payment.entity");
const tuition_controller_1 = require("./tuition.controller");
const tuition_service_1 = require("./tuition.service");
let TuitionModule = class TuitionModule {
};
exports.TuitionModule = TuitionModule;
exports.TuitionModule = TuitionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([student_tuition_plan_entity_1.StudentTuitionPlan, tuition_payment_entity_1.TuitionPayment, student_entity_1.Student]),
        ],
        controllers: [tuition_controller_1.TuitionController],
        providers: [tuition_service_1.TuitionService],
    })
], TuitionModule);
//# sourceMappingURL=tuition.module.js.map