"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const users_module_1 = require("./modules/users/users.module");
const auth_module_1 = require("./modules/auth/auth.module");
const students_module_1 = require("./modules/students/students.module");
const classes_module_1 = require("./modules/classes/classes.module");
const courses_module_1 = require("./modules/courses/courses.module");
const assessments_module_1 = require("./modules/assessments/assessments.module");
const attendance_module_1 = require("./modules/attendance/attendance.module");
const homeworks_module_1 = require("./modules/homeworks/homeworks.module");
const shifts_module_1 = require("./modules/shifts/shifts.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const tuition_module_1 = require("./modules/tuition/tuition.module");
const salary_module_1 = require("./modules/salary/salary.module");
const admin_module_1 = require("./modules/admin/admin.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_DATABASE'),
                    autoLoadEntities: true,
                    synchronize: false,
                    migrationsRun: true,
                    logging: true,
                }),
                inject: [config_1.ConfigService],
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            students_module_1.StudentsModule,
            classes_module_1.ClassesModule,
            courses_module_1.CoursesModule,
            assessments_module_1.AssessmentsModule,
            attendance_module_1.AttendanceModule,
            homeworks_module_1.HomeworksModule,
            shifts_module_1.ShiftsModule,
            schedules_module_1.SchedulesModule,
            tuition_module_1.TuitionModule,
            salary_module_1.SalaryModule,
            admin_module_1.AdminModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map