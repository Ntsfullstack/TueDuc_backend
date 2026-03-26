import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../classes/entities/class.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { Student } from '../students/entities/student.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { AttendanceEditLog } from './entities/attendance-edit-log.entity';
import { AttendanceRecord } from './entities/attendance-record.entity';
import { AttendanceSession } from './entities/attendance-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AttendanceSession,
      AttendanceRecord,
      AttendanceEditLog,
      Class,
      Student,
      Shift,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
