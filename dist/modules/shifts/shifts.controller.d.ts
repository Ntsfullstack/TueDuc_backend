import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { CreateShiftDto } from './dto/create-shift.dto';
import { UpdateShiftDto } from './dto/update-shift.dto';
import { ShiftsService } from './shifts.service';
export declare class ShiftsController {
    private readonly shiftsService;
    constructor(shiftsService: ShiftsService);
    list(): Promise<import("./entities/shift.entity").Shift[]>;
    create(actor: CurrentUserData, dto: CreateShiftDto): Promise<import("./entities/shift.entity").Shift>;
    update(actor: CurrentUserData, id: string, dto: UpdateShiftDto): Promise<import("./entities/shift.entity").Shift | null>;
}
