import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import { ClassSchedule } from '../schedules/entities/class-schedule.entity';
import { Shift } from '../shifts/entities/shift.entity';
import { User } from '../users/entities/user.entity';
import { TeacherSalaryRate } from './entities/teacher-salary-rate.entity';

@Injectable()
export class SalaryService {
  constructor(
    @InjectRepository(TeacherSalaryRate)
    private readonly rateRepository: Repository<TeacherSalaryRate>,
    @InjectRepository(ClassSchedule)
    private readonly scheduleRepository: Repository<ClassSchedule>,
    @InjectRepository(Shift)
    private readonly shiftRepository: Repository<Shift>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private parseMonth(month: string) {
    const m = /^(\d{4})-(\d{2})$/.exec(month);
    if (!m) {
      throw new NotFoundException('invalid month');
    }
    const year = parseInt(m[1], 10);
    const mon = parseInt(m[2], 10);
    const start = new Date(Date.UTC(year, mon - 1, 1));
    const end = new Date(Date.UTC(year, mon, 0));
    return { year, mon, start, end };
  }

  private countWeekdayInMonth(year: number, mon: number, weekday: number) {
    const start = new Date(Date.UTC(year, mon - 1, 1));
    const end = new Date(Date.UTC(year, mon, 0));
    let count = 0;
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      if (d.getUTCDay() === weekday) {
        count += 1;
      }
    }
    return count;
  }

  async setTeacherRate(
    actor: CurrentUserData,
    teacherId: string,
    shiftId: string,
    amountPerSession: number,
  ) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }
    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException('teacher not found');
    }
    const shift = await this.shiftRepository.findOne({
      where: { id: shiftId },
    });
    if (!shift) {
      throw new NotFoundException('shift not found');
    }
    const existing = await this.rateRepository.findOne({
      where: { teacherId, shiftId },
    });
    if (!existing) {
      return this.rateRepository.save(
        this.rateRepository.create({ teacherId, shiftId, amountPerSession }),
      );
    }
    await this.rateRepository.update(existing.id, { amountPerSession });
    return this.rateRepository.findOne({
      where: { id: existing.id },
      relations: ['shift'],
    });
  }

  async listTeacherRates(actor: CurrentUserData, teacherId: string) {
    if (
      actor.role !== Role.ADMIN &&
      !(actor.role === Role.TEACHER && actor.userId === teacherId)
    ) {
      throw new ForbiddenException();
    }
    return this.rateRepository.find({
      where: { teacherId },
      relations: ['shift'],
    });
  }

  async getTeacherSalaryByMonth(
    actor: CurrentUserData,
    teacherId: string,
    month: string,
  ) {
    if (actor.role === Role.TEACHER && actor.userId !== teacherId) {
      throw new ForbiddenException();
    }
    if (actor.role === Role.PARENT) {
      throw new ForbiddenException();
    }

    const teacher = await this.userRepository.findOne({
      where: { id: teacherId },
    });
    if (!teacher || teacher.role !== Role.TEACHER) {
      throw new NotFoundException('teacher not found');
    }

    const { year, mon } = this.parseMonth(month);

    const schedules = await this.scheduleRepository.find({
      where: { teacherId },
      relations: ['class', 'shift'],
    });

    const rates = await this.rateRepository.find({ where: { teacherId } });
    const rateByShift = new Map(
      rates.map((r) => [r.shiftId, Number(r.amountPerSession)]),
    );

    const breakdown = schedules.map((s) => {
      const sessions = this.countWeekdayInMonth(year, mon, s.weekday);
      const rate = rateByShift.get(s.shiftId) ?? 0;
      const amount = sessions * rate;
      return {
        classId: s.classId,
        className: s.class?.name,
        weekday: s.weekday,
        shiftId: s.shiftId,
        shiftName: s.shift?.name,
        sessions,
        rate,
        amount,
      };
    });

    const totalSessions = breakdown.reduce((sum, b) => sum + b.sessions, 0);
    const totalAmount = breakdown.reduce((sum, b) => sum + b.amount, 0);

    return {
      teacherId,
      month,
      totalSessions,
      totalAmount,
      breakdown,
    };
  }
}
