import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity';
import { StudentTuitionPlan } from './entities/student-tuition-plan.entity';
import { TuitionPayment } from './entities/tuition-payment.entity';
import { TuitionController } from './tuition.controller';
import { TuitionService } from './tuition.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StudentTuitionPlan, TuitionPayment, Student]),
  ],
  controllers: [TuitionController],
  providers: [TuitionService],
})
export class TuitionModule {}
