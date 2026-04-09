import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { extname } from 'path';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateHomeworkDto } from './dto/create-homework.dto';
import { GradeSubmissionDto } from './dto/grade-submission.dto';
import { SubmitEssayDto } from './dto/submit-essay.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { UpdateHomeworkDto } from './dto/update-homework.dto';
import { ListHomeworkQueryDto } from './dto/list-homework-query.dto';
import { HomeworksService } from './homeworks.service';

@ApiTags('homeworks')
@ApiBearerAuth()
@Controller('homeworks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class HomeworksController {
  constructor(private readonly homeworksService: HomeworksService) {}

  @Get()
  @ApiOperation({ summary: 'List homeworks (admin/teacher/parent)' })
  list(
    @CurrentUser() actor: CurrentUserData,
    @Query() query: ListHomeworkQueryDto,
  ) {
    return this.homeworksService.list(actor, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create homework (teacher/admin)' })
  create(
    @CurrentUser() actor: CurrentUserData,
    @Body() dto: CreateHomeworkDto,
  ) {
    return this.homeworksService.create(actor, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get homework by id (role-based)' })
  findById(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.homeworksService.findById(actor, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update homework (teacher/admin)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateHomeworkDto,
  ) {
    return this.homeworksService.update(actor, id, dto);
  }

  @Get(':id/status')
  @ApiOperation({
    summary: 'Homework completion status by student (teacher/admin)',
  })
  status(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.homeworksService.homeworkStatus(actor, id);
  }

  @Post(':id/submissions/quiz')
  @ApiOperation({ summary: 'Submit quiz homework (parent)' })
  submitQuiz(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: SubmitQuizDto,
  ) {
    return this.homeworksService.submitQuiz(actor, id, dto);
  }

  @Post(':id/submissions/essay')
  @ApiOperation({
    summary: 'Submit essay homework with photo attachments (parent)',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: 'uploads',
        filename: (
          _req: any,
          file: Express.Multer.File,
          cb: (error: Error | null, filename: string) => void,
        ) => {
          const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          cb(null, `${unique}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  submitEssay(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: SubmitEssayDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const paths = (files || []).map((f) => `/uploads/${f.filename}`);
    return this.homeworksService.submitEssay(actor, id, dto.studentId, paths);
  }

  @Get(':id/submissions')
  @ApiOperation({ summary: 'List submissions of a homework (teacher/admin)' })
  submissions(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.homeworksService.listSubmissions(actor, id);
  }

  @Patch('submissions/:submissionId/grade')
  @ApiOperation({ summary: 'Grade a submission (teacher/admin)' })
  grade(
    @CurrentUser() actor: CurrentUserData,
    @Param('submissionId') submissionId: string,
    @Body() dto: GradeSubmissionDto,
  ) {
    return this.homeworksService.gradeSubmission(actor, submissionId, dto);
  }
}
