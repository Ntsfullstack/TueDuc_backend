import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';
import { AssessmentsService } from './assessments.service';

@ApiTags('assessments')
@ApiBearerAuth()
@Controller('assessments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create assessment (teacher/admin)' })
  create(
    @CurrentUser() actor: CurrentUserData,
    @Body() dto: CreateAssessmentDto,
  ) {
    return this.assessmentsService.create(actor, {
      studentId: dto.studentId,
      courseId: dto.courseId,
      ethicsScore: dto.ethicsScore,
      wisdomScore: dto.wisdomScore,
      willpowerScore: dto.willpowerScore,
      comments: dto.comments,
      assessmentDate: new Date(dto.assessmentDate),
    });
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'List assessments of a student (role-based)' })
  findByStudent(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
  ) {
    return this.assessmentsService.findAllByStudent(actor, studentId);
  }

  @Get('student/:studentId/three-roots')
  @ApiOperation({ summary: 'Three-roots summary for a student (role-based)' })
  threeRoots(
    @CurrentUser() actor: CurrentUserData,
    @Param('studentId') studentId: string,
  ) {
    return this.assessmentsService.getThreeRootsSummary(actor, studentId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get assessment by id (role-based)' })
  findById(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.assessmentsService.findById(actor, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update assessment (teacher/admin)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateAssessmentDto,
  ) {
    return this.assessmentsService.update(actor, id, {
      ethicsScore: dto.ethicsScore,
      wisdomScore: dto.wisdomScore,
      willpowerScore: dto.willpowerScore,
      comments: dto.comments,
      assessmentDate: dto.assessmentDate
        ? new Date(dto.assessmentDate)
        : undefined,
    });
  }
}
