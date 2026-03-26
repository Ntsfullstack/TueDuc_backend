import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from '../attendance/entities/attendance-record.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { StudentTuitionPlan } from '../tuition/entities/student-tuition-plan.entity';
import { TuitionPayment } from '../tuition/entities/tuition-payment.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Class,
      Student,
      User,
      AttendanceSession,
      AttendanceRecord,
      StudentTuitionPlan,
      TuitionPayment,
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
