import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { StudentsModule } from './modules/students/students.module';
import { ClassesModule } from './modules/classes/classes.module';
import { CoursesModule } from './modules/courses/courses.module';
import { AssessmentsModule } from './modules/assessments/assessments.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { HomeworksModule } from './modules/homeworks/homeworks.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { TuitionModule } from './modules/tuition/tuition.module';
import { SalaryModule } from './modules/salary/salary.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false, // Use migrations instead
        migrationsRun: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    StudentsModule,
    ClassesModule,
    CoursesModule,
    AssessmentsModule,
    AttendanceModule,
    HomeworksModule,
    ShiftsModule,
    SchedulesModule,
    TuitionModule,
    SalaryModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
