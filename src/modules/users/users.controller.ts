import { Body, Controller, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserData,
} from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UsersService } from './users.service';
import { SetActiveStudentDto } from './dto/set-active-student.dto';
import { SetUserActiveDto } from './dto/set-user-active.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import * as bcrypt from 'bcrypt';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new user (admin only)' })
  async create(@Body() dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    return this.usersService.create({
      ...dto,
      password: hashedPassword,
    });
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  me(@CurrentUser() user: CurrentUserData) {
    return this.usersService.findById(user.userId);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.userId, dto);
  }

  @Get('me/children')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'List my children (parent)' })
  myChildren(@CurrentUser() actor: CurrentUserData) {
    return this.usersService.listMyChildren(actor.userId);
  }

  @Get('me/active-child')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Get active child and children list (parent)' })
  activeChild(@CurrentUser() actor: CurrentUserData) {
    return this.usersService.getActiveChild(actor.userId);
  }

  @Put('me/active-child')
  @Roles(Role.PARENT)
  @ApiOperation({ summary: 'Set active child (parent)' })
  setActiveChild(
    @CurrentUser() actor: CurrentUserData,
    @Body() dto: SetActiveStudentDto,
  ) {
    return this.usersService.setActiveChild(actor.userId, dto.studentId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List all users with pagination (admin only)' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usersService.findAll(query);
  }

  @Get('teachers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List teachers with pagination (admin)' })
  listTeachers(@Query() query: PaginationQueryDto) {
    return this.usersService.listByRole(Role.TEACHER, query);
  }

  @Get('parents')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List parents with pagination (admin)' })
  listParents(@Query() query: PaginationQueryDto) {
    return this.usersService.listByRole(Role.PARENT, query);
  }

  @Put(':id/active')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Set user active status (admin)' })
  setActive(@Param('id') id: string, @Body() dto: SetUserActiveDto) {
    return this.usersService.setActive(id, dto.isActive);
  }

  @Put(':id/reset-password')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Reset user password (admin)' })
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(id, dto.newPassword);
  }

  @Get(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get user by id (admin only)' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
