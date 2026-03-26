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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const student_entity_1 = require("../students/entities/student.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    userRepository;
    studentRepository;
    constructor(userRepository, studentRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
    }
    async create(userData) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }
    async findByEmail(email) {
        return this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'name', 'role', 'isActive'],
        });
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findAll() {
        return this.userRepository.find();
    }
    async listByRole(role) {
        return this.userRepository.find({ where: { role } });
    }
    async setActive(id, isActive) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        await this.userRepository.update(id, { isActive });
        return this.userRepository.findOne({ where: { id } });
    }
    async resetPassword(id, newPassword) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'password'],
        });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set({ password: hashedPassword })
            .where('id = :id', { id })
            .execute();
        return { updated: true };
    }
    async listMyChildren(parentId) {
        return this.studentRepository.find({
            where: { parentId },
            relations: ['class'],
        });
    }
    async getActiveChild(parentId) {
        const user = await this.userRepository.findOne({ where: { id: parentId } });
        if (!user) {
            throw new common_1.NotFoundException();
        }
        if (!user.activeStudentId) {
            const children = await this.listMyChildren(parentId);
            return {
                activeStudentId: null,
                children,
            };
        }
        const child = await this.studentRepository.findOne({
            where: { id: user.activeStudentId, parentId },
            relations: ['class'],
        });
        if (!child) {
            await this.userRepository.update(parentId, { activeStudentId: null });
            const children = await this.listMyChildren(parentId);
            return {
                activeStudentId: null,
                children,
            };
        }
        const children = await this.listMyChildren(parentId);
        return {
            activeStudentId: child.id,
            activeChild: child,
            children,
        };
    }
    async setActiveChild(parentId, studentId) {
        const child = await this.studentRepository.findOne({
            where: { id: studentId, parentId },
        });
        if (!child) {
            throw new common_1.NotFoundException('student not found');
        }
        await this.userRepository.update(parentId, { activeStudentId: studentId });
        return this.getActiveChild(parentId);
    }
    async remove(id) {
        await this.userRepository.delete(id);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(student_entity_1.Student)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map