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
import { CreateTuitionPaymentDto } from './dto/create-tuition-payment.dto';
import { SetStudentTuitionDto } from './dto/set-student-tuition.dto';
import { TuitionService } from './tuition.service';

@ApiTags('tuition')
@ApiBearerAuth()
@Controller('tuition')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TuitionController {
  constructor(private readonly tuitionService: TuitionService) {}

  @Post('students/:studentId/plan')
  @ApiOperation({ summary: 'Set monthly tuition fee for a student (admin)' })
  setPlan(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
    @Body() dto: SetStudentTuitionDto,
  ) {
    return this.tuitionService.setStudentMonthlyFee(
      actor,
      studentId,
      dto.monthlyFee,
    );
  }

  @Post('students/:studentId/payments')
  @ApiOperation({ summary: 'Create tuition payment record (admin)' })
  createPayment(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
    @Body() dto: CreateTuitionPaymentDto,
  ) {
    return this.tuitionService.createPayment(
      actor,
      studentId,
      dto.month,
      dto.amount,
      dto.method,
      dto.note,
    );
  }

  @Get('students/:studentId')
  @ApiOperation({
    summary: 'Get tuition summary of a student by month (admin/parent)',
  })
  studentMonth(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
    @Query('month') month: string,
  ) {
    return this.tuitionService.getStudentMonthSummary(actor, studentId, month);
  }

  @Get('parent/me')
  @ApiOperation({
    summary: 'Get tuition summary for all my children by month (parent)',
  })
  parentMonth(
    @CurrentUser() actor: CurrentUserData,
    @Query('month') month: string,
  ) {
    return this.tuitionService.getParentSummary(actor, month);
  }

  @Get('unpaid')
  @ApiOperation({ summary: 'List unpaid students by month (admin)' })
  unpaid(
    @CurrentUser() actor: CurrentUserData,
    @Query('month') month: string,
    @Query('classId') classId?: string,
  ) {
    return this.tuitionService.adminUnpaidList(actor, month, classId);
  }

  @Post('unpaid/remind')
  @ApiOperation({
    summary: 'Generate reminder list for unpaid students (admin)',
  })
  remind(
    @CurrentUser() actor: CurrentUserData,
    @Query('month') month: string,
    @Query('classId') classId?: string,
  ) {
    return this.tuitionService.adminUnpaidList(actor, month, classId);
  }
}
