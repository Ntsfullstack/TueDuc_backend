import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { Student } from '../students/entities/student.entity';
import { StudentTuitionPlan } from './entities/student-tuition-plan.entity';
import { TuitionPayment } from './entities/tuition-payment.entity';

@Injectable()
export class TuitionService {
  constructor(
    @InjectRepository(StudentTuitionPlan)
    private readonly planRepository: Repository<StudentTuitionPlan>,
    @InjectRepository(TuitionPayment)
    private readonly paymentRepository: Repository<TuitionPayment>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  private async assertCanAccessStudent(
    actor: CurrentUserData,
    studentId: string,
  ) {
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    if (actor.role === Role.ADMIN) {
      return student;
    }
    if (actor.role === Role.TEACHER) {
      throw new ForbiddenException();
    }
    if (actor.role === Role.PARENT) {
      if (student.parentId !== actor.userId) {
        throw new ForbiddenException();
      }
      return student;
    }
    throw new ForbiddenException();
  }

  async setStudentMonthlyFee(
    actor: CurrentUserData,
    studentId: string,
    monthlyFee: number,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    const existing = await this.planRepository.findOne({
      where: { studentId },
    });
    if (!existing) {
      return this.planRepository.save(
        this.planRepository.create({ studentId, monthlyFee }),
      );
    }
    await this.planRepository.update(existing.id, { monthlyFee });
    return this.planRepository.findOne({ where: { id: existing.id } });
  }

  async createPayment(
    actor: CurrentUserData,
    studentId: string,
    month: string,
    amount: number,
    method?: string,
    note?: string,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const student = await this.studentRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('student not found');
    }
    const payment = this.paymentRepository.create({
      studentId,
      month,
      amount,
      createdById: actor.userId,
      method: method ?? null,
      note: note ?? null,
    });
    return this.paymentRepository.save(payment);
  }

  async getStudentMonthSummary(
    actor: CurrentUserData,
    studentId: string,
    month: string,
  ) {
    await this.assertCanAccessStudent(actor, studentId);
    const plan = await this.planRepository.findOne({ where: { studentId } });
    const due = plan ? Number(plan.monthlyFee) : 0;
    const payments = await this.paymentRepository.find({
      where: { studentId, month },
      order: { paidAt: 'DESC' },
    });
    const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
    const debt = Math.max(0, due - paid);
    return {
      studentId,
      month,
      due,
      paid,
      debt,
      status: debt === 0 ? 'paid' : 'debt',
      payments,
    };
  }

  async getParentSummary(actor: CurrentUserData, month: string) {
    if (actor.role !== Role.PARENT) {
      throw new ForbiddenException();
    }
    const children = await this.studentRepository.find({
      where: { parentId: actor.userId },
    });
    const results = [];
    for (const c of children) {
      results.push(await this.getStudentMonthSummary(actor, c.id, month));
    }
    return results;
  }

  async adminUnpaidList(
    actor: CurrentUserData,
    month: string,
    classId?: string,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const where: FindOptionsWhere<Student> = classId ? { classId } : {};
    const students = await this.studentRepository.find({
      where,
      relations: ['class', 'parent'],
    });
    const studentIds = students.map((s) => s.id);
    if (studentIds.length === 0) {
      return [];
    }

    const plans = await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.studentId IN (:...ids)', { ids: studentIds })
      .getMany();
    const planByStudent = new Map(
      plans.map((p) => [p.studentId, Number(p.monthlyFee)]),
    );

    const payments = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('payment.studentId', 'studentId')
      .addSelect('SUM(payment.amount)', 'paid')
      .where('payment.studentId IN (:...ids)', { ids: studentIds })
      .andWhere('payment.month = :month', { month })
      .groupBy('payment.studentId')
      .getRawMany<{ studentId: string; paid: string }>();
    const paidByStudent = new Map(
      payments.map((p) => [p.studentId, Number(p.paid)]),
    );

    return students
      .map((s) => {
        const due = planByStudent.get(s.id) ?? 0;
        const paid = paidByStudent.get(s.id) ?? 0;
        const debt = Math.max(0, due - paid);
        return {
          studentId: s.id,
          studentName: s.name,
          classId: s.classId ?? null,
          className: s.class?.name ?? null,
          parentId: s.parentId ?? null,
          parentEmail: s.parent?.email ?? null,
          month,
          due,
          paid,
          debt,
          status: debt === 0 ? 'paid' : 'debt',
        };
      })
      .filter((x) => x.debt > 0);
  }
}
