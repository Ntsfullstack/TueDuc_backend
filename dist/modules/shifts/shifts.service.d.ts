import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { Shift } from './entities/shift.entity';
export declare class ShiftsService {
    private readonly shiftRepository;
    constructor(shiftRepository: Repository<Shift>);
    list(): Promise<Shift[]>;
    create(actor: CurrentUserData, dto: CreateShiftDto): Promise<Shift>;
    update(actor: CurrentUserData, id: string, dto: UpdateShiftDto): Promise<Shift | null>;
}
