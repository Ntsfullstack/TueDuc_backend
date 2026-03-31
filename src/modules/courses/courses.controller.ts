import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
import { CreateCourseDto } from './dto/create-course.dto';
import { ListCourseQueryDto } from './dto/list-course-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesService } from './courses.service';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'List courses with pagination & filter (admin/teacher)' })
  findAll(
    @CurrentUser() actor: CurrentUserData,
    @Query() query: ListCourseQueryDto,
  ) {
    return this.coursesService.findAll(actor, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get course by id (admin/teacher)' })
  findById(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.coursesService.findById(actor, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create course (admin)' })
  create(@CurrentUser() actor: CurrentUserData, @Body() dto: CreateCourseDto) {
    return this.coursesService.create(actor, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update course (admin)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateCourseDto,
  ) {
    return this.coursesService.update(actor, id, dto);
  }
}
