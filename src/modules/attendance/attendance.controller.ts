import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';

@ApiTags('attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('mark')
  @ApiOperation({ summary: 'Mark attendance for a class/day (teacher/admin)' })
  mark(@CurrentUser() actor: CurrentUserData, @Body() dto: MarkAttendanceDto) {
    return this.attendanceService.mark(actor, dto);
  }

  @Get('class/:classId')
  @ApiOperation({
    summary: 'Get attendance session by class and date (teacher/admin)',
  })
  getByClassDate(
    @CurrentUser() actor: CurrentUserData,
    @Param('classId') classId: string,
    @Query('date') date: string,
    @Query('shiftId') shiftId: string,
  ) {
    return this.attendanceService.getByClassDate(actor, classId, date, shiftId);
  }

  @Get('student/:studentId')
  @ApiOperation({
    summary: 'Get attendance records by student (parent/teacher/admin)',
  })
  getByStudent(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
  ) {
    return this.attendanceService.getByStudent(actor, studentId);
  }

  @Get('admin/sessions')
  @ApiOperation({ summary: 'List attendance sessions by day/shift (admin)' })
  adminSessions(
    @CurrentUser() actor: CurrentUserData,
    @Query('date') date: string,
    @Query('shiftId') shiftId: string,
  ) {
    return this.attendanceService.adminListSessions(actor, date, shiftId);
  }

  @Patch('sessions/:sessionId')
  @ApiOperation({
    summary: 'Admin edit attendance session and save audit log (admin)',
  })
  adminUpdateSession(
    @CurrentUser() actor: CurrentUserData,
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.adminUpdateSession(actor, sessionId, dto);
  }

  @Get('sessions/:sessionId/edits')
  @ApiOperation({ summary: 'Get attendance edit logs (admin)' })
  adminEditLogs(
    @CurrentUser() actor: CurrentUserData,
    @Param('sessionId') sessionId: string,
  ) {
    return this.attendanceService.adminEditLogs(actor, sessionId);
  }
}
