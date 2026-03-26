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
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftsService } from './shifts.service';

@ApiTags('shifts')
@ApiBearerAuth()
@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ShiftsController {
  constructor(private readonly shiftsService: ShiftsService) {}

  @Get()
  @ApiOperation({ summary: 'List shifts' })
  list() {
    return this.shiftsService.list();
  }

  @Post()
  @ApiOperation({ summary: 'Create shift (admin)' })
  create(@CurrentUser() actor: CurrentUserData, @Body() dto: CreateShiftDto) {
    return this.shiftsService.create(actor, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update shift (admin)' })
  update(
    @CurrentUser() actor: CurrentUserData,
    @Param('id') id: string,
    @Body() dto: UpdateShiftDto,
  ) {
    return this.shiftsService.update(actor, id, dto);
  }
}
