import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { SchedulesService } from './schedules.service';

@ApiTags('schedules')
@ApiBearerAuth()
@Controller('schedules')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SchedulesController {
  constructor(private readonly schedulesService: SchedulesService) {}

  @Post('classes')
  @ApiOperation({ summary: 'Create class schedule (admin)' })
  createClassSchedule(
    @CurrentUser() actor: CurrentUserData,
    @Body() dto: CreateClassScheduleDto,
  ) {
    return this.schedulesService.createClassSchedule(actor, dto);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'List schedules by class (admin/teacher)' })
  listByClass(
    @CurrentUser() actor: CurrentUserData,
    @Param('classId') classId: string,
  ) {
    return this.schedulesService.listByClass(actor, classId);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get student schedule by date (parent/teacher/admin)',
  })
  studentSchedule(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
    @Query('date') date: string,
  ) {
    return this.schedulesService.getStudentScheduleByDate(
      actor,
      studentId,
      date,
    );
  }

  @Get('teacher/me')
  @ApiOperation({ summary: 'Get teacher schedule by date (teacher/admin)' })
  teacherSchedule(
    @CurrentUser() actor: CurrentUserData,
    @Query('date') date: string,
  ) {
    return this.schedulesService.getTeacherScheduleByDate(actor, date);
  }

  @Get('teacher/:teacherId')
  @ApiOperation({ summary: 'Get teacher schedule by date (admin)' })
  teacherScheduleById(
    @CurrentUser() actor: CurrentUserData,
    @Param('teacherId') teacherId: string,
    @Query('date') date: string,
  ) {
    return this.schedulesService.getTeacherScheduleByDateForTeacher(
      actor,
      teacherId,
      date,
    );
  }

  @Get('center/week')
  @ApiOperation({ summary: 'Get center schedule for a week (admin)' })
  centerWeek(
    @CurrentUser() actor: CurrentUserData,
    @Query('start') start: string,
  ) {
    return this.schedulesService.getCenterScheduleWeek(actor, start);
  }
}
