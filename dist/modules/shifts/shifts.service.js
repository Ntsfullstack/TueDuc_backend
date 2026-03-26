"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShiftsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_enum_1 = require("../../common/enums/role.enum");
const shift_entity_1 = require("./entities/shift.entity");
let ShiftsService = class ShiftsService {
    shiftRepository;
    constructor(shiftRepository) {
        this.shiftRepository = shiftRepository;
    }
    async list() {
        return this.shiftRepository.find();
    }
    async create(actor, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        return this.shiftRepository.save(this.shiftRepository.create(dto));
    }
    async update(actor, id, dto) {
        if (actor.role !== role_enum_1.Role.ADMIN) {
            throw new common_1.ForbiddenException();
        }
        const shift = await this.shiftRepository.findOne({ where: { id } });
        if (!shift) {
            throw new common_1.NotFoundException();
        }
        await this.shiftRepository.update(id, {
            name: dto.name ?? shift.name,
            startTime: dto.startTime ?? shift.startTime,
            endTime: dto.endTime ?? shift.endTime,
        });
        return this.shiftRepository.findOne({ where: { id } });
    }
};
exports.ShiftsService = ShiftsService;
exports.ShiftsService = ShiftsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(shift_entity_1.Shift)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ShiftsService);
//# sourceMappingURL=shifts.service.js.map