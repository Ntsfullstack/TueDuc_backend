import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';
import { PaginatedResponse } from '../../common/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'name', 'role', 'isActive', 'phoneNumber'],
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { phoneNumber },
      select: ['id', 'email', 'password', 'name', 'role', 'isActive', 'phoneNumber'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(
    query: PaginationQueryDto = {},
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 20, search } = query;

    const qb = this.userRepository.createQueryBuilder('user');

    if (search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('user.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponse(data, total, page, limit);
  }

  async listByRole(
    role: Role,
    query: PaginationQueryDto = {},
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 20, search } = query;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .andWhere('user.role = :role', { role });

    if (search) {
      qb.andWhere(
        '(user.name ILIKE :search OR user.email ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.skip((page - 1) * limit).take(limit);
    qb.orderBy('user.createdAt', 'DESC');

    const [data, total] = await qb.getManyAndCount();
    return new PaginatedResponse(data, total, page, limit);
  }

  async setActive(id: string, isActive: boolean) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException();
    }
    await this.userRepository.update(id, { isActive });
    return this.userRepository.findOne({ where: { id } });
  }

  async resetPassword(id: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword } as unknown as Partial<User>)
      .where('id = :id', { id })
      .execute();
    return { updated: true };
  }

  async listMyChildren(parentId: string) {
    return this.studentRepository.find({
      where: { parentId },
      relations: ['class'],
    });
  }

  async getActiveChild(parentId: string) {
    const user = await this.userRepository.findOne({ where: { id: parentId } });
    if (!user) {
      throw new NotFoundException();
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

  async setActiveChild(parentId: string, studentId: string) {
    const child = await this.studentRepository.findOne({
      where: { id: studentId, parentId },
    });
    if (!child) {
      throw new NotFoundException('student not found');
    }
    await this.userRepository.update(parentId, { activeStudentId: studentId });
    return this.getActiveChild(parentId);
  }

  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async updateProfile(id: string, data: Partial<User>) {
    const user = await this.findById(id);
    await this.userRepository.update(id, data);
    return this.findById(id);
  }
}
