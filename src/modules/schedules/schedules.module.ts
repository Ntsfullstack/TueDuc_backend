import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../classes/entities/class.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { SchedulesController } from './schedules.controller';
import { SchedulesService } from './schedules.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassSchedule, Class, Student, User, Shift]),
  ],
  controllers: [SchedulesController],
  providers: [SchedulesService],
})
export class SchedulesModule {}
