import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { User } from '../users/entities/user.entity';
import { SalaryController } from './salary.controller';
import { SalaryService } from './salary.service';
import { TeacherSalaryRate } from './entities/teacher-salary-rate.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeacherSalaryRate, ClassSchedule, Shift, User]),
  ],
  controllers: [SalaryController],
  providers: [SalaryService],
})
export class SalaryModule {}
