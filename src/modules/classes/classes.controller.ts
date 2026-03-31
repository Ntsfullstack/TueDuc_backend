import {
  Body,
  Controller,
  Delete,
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
import { CreateClassDto } from './dto/create-class.dto';
import { ListClassQueryDto } from './dto/list-class-query.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { ClassesService } from './classes.service';
import { ClassStatus } from './entities/class.entity';

class SetClassStatusDto {
  status: ClassStatus;
}

@ApiTags('classes')
@ApiBearerAuth()
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'List classes with pagination & filter (admin/teacher)' })
  findAll(
    @CurrentUser() actor: CurrentUserData,
    @Query() query: ListClassQueryDto,
  ) {
    return this.classesService.findAll(actor, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by id (admin/teacher)' })
  findById(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.classesService.findById(actor, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create class (admin)' })
  create(@CurrentUser() actor: CurrentUserData, @Body() dto: CreateClassDto) {
    return this.classesService.create(actor, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class (admin)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateClassDto,
  ) {
    return this.classesService.update(actor, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class (admin)' })
  remove(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.classesService.remove(actor, id);
  }

  @Post(':id/clone')
  @ApiOperation({ summary: 'Clone class (admin)' })
  clone(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.classesService.clone(actor, id);
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive class (admin)' })
  archive(@CurrentUser() actor: CurrentUserData, @Param('id') id: string) {
    return this.classesService.archive(actor, id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Set class status open/paused/closed (admin)' })
  setStatus(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: SetClassStatusDto,
  ) {
    return this.classesService.setStatus(actor, id, dto.status);
  }
}
