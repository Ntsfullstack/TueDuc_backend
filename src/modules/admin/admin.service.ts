import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CurrentUserData } from '../../common/decorators/current-user.decorator';
import { Role } from '../../common/enums/role.enum';
import {
  AttendanceRecord,
  AttendanceStatus,
} from '../attendance/entities/attendance-record.entity';
import { AttendanceSession } from '../attendance/entities/attendance-session.entity';
import { Class, ClassStatus } from '../classes/entities/class.entity';
import { Student } from '../students/entities/student.entity';
import { User } from '../users/entities/user.entity';
import { StudentTuitionPlan } from '../tuition/entities/student-tuition-plan.entity';
import { TuitionPayment } from '../tuition/entities/tuition-payment.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AttendanceSession)
    private readonly attendanceSessionRepository: Repository<AttendanceSession>,
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepository: Repository<AttendanceRecord>,
    @InjectRepository(StudentTuitionPlan)
    private readonly tuitionPlanRepository: Repository<StudentTuitionPlan>,
    @InjectRepository(TuitionPayment)
    private readonly tuitionPaymentRepository: Repository<TuitionPayment>,
  ) {}

  private todayDateString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private currentMonthString() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    return `${yyyy}-${mm}`;
  }

  async dashboard(actor: CurrentUserData, month?: string, date?: string) {
    if (actor.role !== Role.ADMIN) {
      throw new ForbiddenException();
    }

    const reportMonth = month ?? this.currentMonthString();
    const reportDate = date ?? this.todayDateString();

    const [totalClasses, totalStudents] = await Promise.all([
      this.classRepository.count(),
      this.studentRepository.count(),
    ]);

    const activeClasses = await this.classRepository.count({
      where: { status: ClassStatus.OPEN, archivedAt: IsNull() },
    });

    const totalTeachers = await this.userRepository.count({
      where: { role: Role.TEACHER, isActive: true },
    });

    const sessionsToday = await this.attendanceSessionRepository.count({
      where: { date: reportDate },
    });

    const attendanceRaw = await this.attendanceRecordRepository
      .createQueryBuilder('record')
      .leftJoin('record.session', 'session')
      .select('COUNT(record.id)', 'total')
      .addSelect(
        `SUM(CASE WHEN record.status = :present THEN 1 ELSE 0 END)`,
        'present',
      )
      .where('session.date = :date', { date: reportDate })
      .setParameter('present', AttendanceStatus.PRESENT)
      .getRawOne<{ total: string; present: string }>();

    const totalAttendance = Number(attendanceRaw?.total ?? 0);
    const presentAttendance = Number(attendanceRaw?.present ?? 0);
    const attendanceRate =
      totalAttendance > 0 ? presentAttendance / totalAttendance : 0;

    const students = await this.studentRepository.find();
    const studentIds = students.map((s) => s.id);
    const plans = studentIds.length
      ? await this.tuitionPlanRepository
          .createQueryBuilder('plan')
          .where('plan.studentId IN (:...ids)', { ids: studentIds })
          .getMany()
      : [];
    const planByStudent = new Map(
      plans.map((p) => [p.studentId, Number(p.monthlyFee)]),
    );
    const tuitionDue = students.reduce(
      (sum, s) => sum + (planByStudent.get(s.id) ?? 0),
      0,
    );

    const tuitionPaidRaw = await this.tuitionPaymentRepository
      .createQueryBuilder('payment')
      .select('COALESCE(SUM(payment.amount), 0)', 'paid')
      .where('payment.month = :month', { month: reportMonth })
      .getRawOne<{ paid: string }>();
    const tuitionPaid = Number(tuitionPaidRaw?.paid ?? 0);
    const tuitionDebt = Math.max(0, tuitionDue - tuitionPaid);

    return {
      totals: {
        classes: totalClasses,
        students: totalStudents,
        teachers: totalTeachers,
        activeClasses,
      },
      attendance: {
        date: reportDate,
        sessions: sessionsToday,
        totalRecords: totalAttendance,
        presentRecords: presentAttendance,
        rate: attendanceRate,
      },
      tuition: {
        month: reportMonth,
        due: tuitionDue,
        paid: tuitionPaid,
        debt: tuitionDebt,
      },
    };
  }
}
