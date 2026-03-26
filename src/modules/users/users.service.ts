import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Student } from '../students/entities/student.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../common/enums/role.enum';

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
      select: ['id', 'email', 'password', 'name', 'role', 'isActive'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async listByRole(role: Role) {
    return this.userRepository.find({ where: { role } });
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
}
