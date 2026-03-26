"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeworksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const class_entity_1 = require("../classes/entities/class.entity");
const student_entity_1 = require("../students/entities/student.entity");
const user_entity_1 = require("../users/entities/user.entity");
const homeworks_controller_1 = require("./homeworks.controller");
const homeworks_service_1 = require("./homeworks.service");
const homework_submission_entity_1 = require("./entities/homework-submission.entity");
const homework_target_entity_1 = require("./entities/homework-target.entity");
const homework_entity_1 = require("./entities/homework.entity");
let HomeworksModule = class HomeworksModule {
};
exports.HomeworksModule = HomeworksModule;
exports.HomeworksModule = HomeworksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                homework_entity_1.Homework,
                homework_target_entity_1.HomeworkTarget,
                homework_submission_entity_1.HomeworkSubmission,
                class_entity_1.Class,
                student_entity_1.Student,
                user_entity_1.User,
            ]),
        ],
        controllers: [homeworks_controller_1.HomeworksController],
        providers: [homeworks_service_1.HomeworksService],
    })
], HomeworksModule);
//# sourceMappingURL=homeworks.module.js.map