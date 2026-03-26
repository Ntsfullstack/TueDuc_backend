import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';

@Injectable()
export class ShiftsService {
  constructor(
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
  ) {}

  async list() {
    return this.shiftRepository.find();
  }

  async create(actor: CurrentUserData, dto: CreateShiftDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    return this.shiftRepository.save(this.shiftRepository.create(dto));
  }

  async update(actor: CurrentUserData, id: string, dto: UpdateShiftDto) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const shift = await this.shiftRepository.findOne({ where: { id } });
    if (!shift) {
      throw new NotFoundException();
    }
    await this.shiftRepository.update(id, {
      name: dto.name ?? shift.name,
      startTime: dto.startTime ?? shift.startTime,
      endTime: dto.endTime ?? shift.endTime,
    });
    return this.shiftRepository.findOne({ where: { id } });
  }
}
