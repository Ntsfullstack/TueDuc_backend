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
exports.ShiftsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const create_shift_dto_1 = require("./dto/create-shift.dto");
const update_shift_dto_1 = require("./dto/update-shift.dto");
const shifts_service_1 = require("./shifts.service");
let ShiftsController = class ShiftsController {
    shiftsService;
    constructor(shiftsService) {
        this.shiftsService = shiftsService;
    }
    list() {
        return this.shiftsService.list();
    }
    create(actor, dto) {
        return this.shiftsService.create(actor, dto);
    }
    update(actor, id, dto) {
        return this.shiftsService.update(actor, id, dto);
    }
};
exports.ShiftsController = ShiftsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List shifts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create shift (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_shift_dto_1.CreateShiftDto]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update shift (admin)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_shift_dto_1.UpdateShiftDto]),
    __metadata("design:returntype", void 0)
], ShiftsController.prototype, "update", null);
exports.ShiftsController = ShiftsController = __decorate([
    (0, swagger_1.ApiTags)('shifts'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('shifts'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [shifts_service_1.ShiftsService])
], ShiftsController);
//# sourceMappingURL=shifts.controller.js.map