import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Class } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { HomeworksController } from './homeworks.controller';
import { HomeworksService } from './homeworks.service';
import { HomeworkSubmission } from './entities/homework-submission.entity';
import { HomeworkTarget } from './entities/homework-target.entity';
import { Homework } from './entities/homework.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Homework,
      HomeworkTarget,
      HomeworkSubmission,
      Class,
      Student,
      User,
    ]),
  ],
  controllers: [HomeworksController],
  providers: [HomeworksService],
})
export class HomeworksModule {}
