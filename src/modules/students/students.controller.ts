import {
  Body,
  Controller,
  Delete,
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
import { CreateStudentDto } from './dto/create-student.dto';
import { ClaimStudentDto } from './dto/claim-student.dto';
import { LinkParentDto } from './dto/link-parent.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentsService } from './students.service';

class TransferStudentDto {
  classId: string;
}

@ApiTags('students')
@ApiBearerAuth()
@Controller('students')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get('my')
  @ApiOperation({ summary: 'List my children (parent only)' })
  my(@CurrentUser() actor: CurrentUserData) {
    return this.studentsService.findMyChildren(actor);
  }

  @Get()
  @ApiOperation({ summary: 'List students (admin/teacher)' })
  findAll(@CurrentUser() actor: CurrentUserData) {
    return this.studentsService.findAll(actor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get student by id (role-based)' })
  findById(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.studentsService.findById(actor, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create student (admin/teacher)' })
  create(@CurrentUser() actor: CurrentUserData, @Body() dto: CreateStudentDto) {
    return this.studentsService.create(actor, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update student (admin/teacher)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateStudentDto,
  ) {
    return this.studentsService.update(actor, id, dto);
  }

  @Patch(':id/transfer')
  @ApiOperation({ summary: 'Transfer student to another class (admin)' })
  transfer(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: TransferStudentDto,
  ) {
    return this.studentsService.transfer(actor, id, dto.classId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete student (admin)' })
  remove(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.studentsService.remove(actor, id);
  }

  @Patch(':id/link-parent')
  @ApiOperation({ summary: 'Link a parent account to a student (admin)' })
  linkParent(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: LinkParentDto,
  ) {
    return this.studentsService.linkParent(actor, id, dto.parentId);
  }

  @Patch(':id/unlink-parent')
  @ApiOperation({ summary: 'Unlink parent from a student (admin)' })
  unlinkParent(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.studentsService.unlinkParent(actor, id);
  }

  @Post('claim')
  @ApiOperation({
    summary: 'Parent claims a child by student code (parent only)',
  })
  claim(@CurrentUser() actor: CurrentUserData, @Body() dto: ClaimStudentDto) {
    return this.studentsService.claimStudent(actor, dto.studentCode);
  }

  @Post(':id/regenerate-code')
  @ApiOperation({ summary: 'Admin regenerates student code (admin)' })
  regenerateCode(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
  ) {
    return this.studentsService.regenerateCode(actor, id);
  }
}

