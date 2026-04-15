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
import { SetTeacherRateDto } from './dto/set-teacher-rate.dto';
import { SalaryService } from './salary.service';

@ApiTags('salary')
@ApiBearerAuth()
@Controller('salary')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SalaryController {
  constructor(private readonly salaryService: SalaryService) {}

  @Post('teachers/:teacherId/rates')
  @ApiOperation({ summary: 'Set teacher rate per shift (admin)' })
  setRate(
    @CurrentUser() actor: CurrentUserData,
    @Param('teacherId') teacherId: string,
    @Body() dto: SetTeacherRateDto,
  ) {
    return this.salaryService.setTeacherRate(
      actor,
      teacherId,
      dto.shiftId,
      dto.amountPerSession,
    );
  }

  @Get('teachers/:teacherId/rates')
  @ApiOperation({ summary: 'List teacher rates (admin/teacher self)' })
  listRates(
    @CurrentUser() actor: CurrentUserData,
    @Param('teacherId') teacherId: string,
  ) {
    return this.salaryService.listTeacherRates(actor, teacherId);
  }

  @Get('teachers/:teacherId')
  @ApiOperation({
    summary: 'Teacher salary report by month (admin/teacher self)',
  })
  teacherSalary(
    @CurrentUser() actor: CurrentUserData,
    @Param('teacherId') teacherId: string,
    @Query('month') month: string,
  ) {
    return this.salaryService.getTeacherSalaryByMonth(actor, teacherId, month);
  }

  @Get('teachers/:teacherId/history')
  @ApiOperation({ summary: 'Teacher salary history (admin/teacher self)' })
  teacherSalaryHistory(
    @CurrentUser() actor: CurrentUserData,
    @Param('teacherId') teacherId: string,
  ) {
    return this.salaryService.getTeacherSalaryHistory(actor, teacherId);
  }

  @Get('teachers/me')
  @ApiOperation({ summary: 'My salary report by month (teacher)' })
  mySalary(
    @CurrentUser() actor: CurrentUserData,
    @Query('month') month: string,
  ) {
    return this.salaryService.getTeacherSalaryByMonth(
      actor,
      actor.userId,
      month,
    );
  }

  @Get('me/history')
  @ApiOperation({ summary: 'My salary history (teacher)' })
  mySalaryHistory(@CurrentUser() actor: CurrentUserData) {
    return this.salaryService.getTeacherSalaryHistory(actor, actor.userId);
  }

  @Get('summary')
  @ApiOperation({ summary: 'Total salary summary for all teachers (admin)' })
  async listSummary(
    @CurrentUser() actor: CurrentUserData,
    @Query('month') month: string,
  ) {
    return this.salaryService.getAllTeachersSalarySummary(actor, month);
  }
}
