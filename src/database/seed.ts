import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { User } from '../modules/users/entities/user.entity';
import { Shift } from '../modules/shifts/entities/shift.entity';
import { Class, ClassStatus } from '../modules/classes/entities/class.entity';
import { Student, StudentStatus } from '../modules/students/entities/student.entity';
import { Course } from '../modules/courses/entities/course.entity';
import { ClassSchedule } from '../modules/schedules/entities/class-schedule.entity';
import { AttendanceSession } from '../modules/attendance/entities/attendance-session.entity';
import { AttendanceRecord, AttendanceStatus } from '../modules/attendance/entities/attendance-record.entity';
import { Homework, HomeworkType, HomeworkTargetScope } from '../modules/homeworks/entities/homework.entity';
import { HomeworkTarget } from '../modules/homeworks/entities/homework-target.entity';
import { HomeworkSubmission, HomeworkSubmissionStatus } from '../modules/homeworks/entities/homework-submission.entity';
import { Assessment } from '../modules/assessments/entities/assessment.entity';
import { TeacherSalaryRate } from '../modules/salary/entities/teacher-salary-rate.entity';
import { StudentTuitionPlan } from '../modules/tuition/entities/student-tuition-plan.entity';
import { TuitionPayment } from '../modules/tuition/entities/tuition-payment.entity';

config();

async function seed() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      User, Shift, Class, Student, Course, 
      ClassSchedule, AttendanceSession, AttendanceRecord,
      Homework, HomeworkTarget, HomeworkSubmission,
      Assessment, TeacherSalaryRate, StudentTuitionPlan, TuitionPayment
    ],
    synchronize: true,
  });

  await dataSource.initialize();
  process.stdout.write('Database connection initialized\n');

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  
  // Truncate all tables to start fresh
  const tables = [
    'tuition_payments', 'student_tuition_plans', 'teacher_salary_rates',
    'assessments', 'homework_submissions', 'homework_targets', 'homeworks',
    'attendance_records', 'attendance_sessions', 'class_schedules',
    'courses', 'students', 'classes', 'shifts', 'users'
  ];
  
  process.stdout.write('Cleaning up existing data...\n');
  for (const table of tables) {
    await queryRunner.query(`TRUNCATE TABLE "${table}" CASCADE`);
  }

  const userRepo = dataSource.getRepository(User);
  const shiftRepo = dataSource.getRepository(Shift);
  const classRepo = dataSource.getRepository(Class);
  const studentRepo = dataSource.getRepository(Student);
  const courseRepo = dataSource.getRepository(Course);
  const scheduleRepo = dataSource.getRepository(ClassSchedule);
  const sessionRepo = dataSource.getRepository(AttendanceSession);
  const recordRepo = dataSource.getRepository(AttendanceRecord);
  const homeworkRepo = dataSource.getRepository(Homework);
  const targetRepo = dataSource.getRepository(HomeworkTarget);
  const submissionRepo = dataSource.getRepository(HomeworkSubmission);
  const assessmentRepo = dataSource.getRepository(Assessment);
  const salaryRepo = dataSource.getRepository(TeacherSalaryRate);
  const planRepo = dataSource.getRepository(StudentTuitionPlan);
  const paymentRepo = dataSource.getRepository(TuitionPayment);

  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Seed Users
  process.stdout.write('Seeding Users...\n');
  const admin = await userRepo.save(userRepo.create({
    email: 'admin@tueduc.edu.vn',
    password: hashedPassword,
    name: 'Admin Hệ Thống',
    role: Role.ADMIN,
    phoneNumber: '0900000000',
  }));

  const teachers = await userRepo.save([
    { email: 'teacher1@tueduc.edu.vn', password: hashedPassword, name: 'Nguyễn Văn A', role: Role.TEACHER, phoneNumber: '0910000001' },
    { email: 'teacher2@tueduc.edu.vn', password: hashedPassword, name: 'Trần Thị B', role: Role.TEACHER, phoneNumber: '0910000002' },
    { email: 'teacher3@tueduc.edu.vn', password: hashedPassword, name: 'Lê Văn C', role: Role.TEACHER, phoneNumber: '0910000003' },
    { email: 'teacher4@tueduc.edu.vn', password: hashedPassword, name: 'Phạm Thị D', role: Role.TEACHER, phoneNumber: '0910000004' },
    { email: 'teacher5@tueduc.edu.vn', password: hashedPassword, name: 'Hoàng Văn E', role: Role.TEACHER, phoneNumber: '0910000005' },
  ].map(u => userRepo.create(u)));

  const parents = await userRepo.save([
    { email: 'parent1@gmail.com', password: hashedPassword, name: 'Phụ Huynh 1', role: Role.PARENT, phoneNumber: '0920000001' },
    { email: 'parent2@gmail.com', password: hashedPassword, name: 'Phụ Huynh 2', role: Role.PARENT, phoneNumber: '0920000002' },
    { email: 'parent3@gmail.com', password: hashedPassword, name: 'Phụ Huynh 3', role: Role.PARENT, phoneNumber: '0920000003' },
    { email: 'parent4@gmail.com', password: hashedPassword, name: 'Phụ Huynh 4', role: Role.PARENT, phoneNumber: '0920000004' },
    { email: 'parent5@gmail.com', password: hashedPassword, name: 'Phụ Huynh 5', role: Role.PARENT, phoneNumber: '0920000005' },
  ].map(u => userRepo.create(u)));

  // 2. Seed Shifts
  process.stdout.write('Seeding Shifts...\n');
  const shifts = await shiftRepo.save([
    { name: 'Sáng 1', startTime: '07:30:00', endTime: '09:00:00' },
    { name: 'Sáng 2', startTime: '09:15:00', endTime: '10:45:00' },
    { name: 'Chiều 1', startTime: '13:30:00', endTime: '15:00:00' },
    { name: 'Chiều 2', startTime: '15:15:00', endTime: '16:45:00' },
  ].map(s => shiftRepo.create(s)));

  // 3. Seed Classes
  process.stdout.write('Seeding Classes...\n');
  const classes = await classRepo.save([
    { name: 'Lớp 10A1', grade: '10', academicYear: '2023-2024', homeroomTeacherId: teachers[0].id, status: ClassStatus.OPEN },
    { name: 'Lớp 11B2', grade: '11', academicYear: '2023-2024', homeroomTeacherId: teachers[1].id, status: ClassStatus.OPEN },
    { name: 'Lớp 12C3', grade: '12', academicYear: '2023-2024', homeroomTeacherId: teachers[2].id, status: ClassStatus.OPEN },
    { name: 'Lớp 10A2', grade: '10', academicYear: '2023-2024', homeroomTeacherId: teachers[3].id, status: ClassStatus.OPEN },
  ].map(c => classRepo.create(c)));

  // 4. Seed Students
  process.stdout.write('Seeding Students...\n');
  const studentData = [];
  for (let i = 0; i < 20; i++) {
    const parentIndex = Math.floor(i / 2) % parents.length;
    const classIndex = i % classes.length;
    studentData.push(studentRepo.create({
      name: `Học Sinh ${i + 1}`,
      studentCode: `HS${1000 + i}`,
      gender: i % 2 === 0 ? 'Nam' : 'Nữ',
      dateOfBirth: new Date(2008, 0, i + 1),
      parentId: parents[parentIndex].id,
      classId: classes[classIndex].id,
      status: StudentStatus.ACTIVE,
    }));
  }
  const students = await studentRepo.save(studentData);

  // 5. Seed Courses
  process.stdout.write('Seeding Courses...\n');
  const courses = await courseRepo.save([
    { name: 'Toán Học 10', code: 'MATH10', classId: classes[0].id, teacherId: teachers[0].id },
    { name: 'Ngữ Văn 10', code: 'LIT10', classId: classes[0].id, teacherId: teachers[4].id },
    { name: 'Vật Lý 11', code: 'PHYS11', classId: classes[1].id, teacherId: teachers[1].id },
    { name: 'Hóa Học 12', code: 'CHEM12', classId: classes[2].id, teacherId: teachers[2].id },
  ].map(c => courseRepo.create(c)));

  // 6. Seed Schedules (Mon-Fri)
  process.stdout.write('Seeding Schedules...\n');
  const scheduleData: ClassSchedule[] = [];
  for (let day = 1; day <= 5; day++) {
    scheduleData.push(scheduleRepo.create({ classId: classes[0].id, weekday: day, shiftId: shifts[0].id, teacherId: teachers[0].id }));
    scheduleData.push(scheduleRepo.create({ classId: classes[1].id, weekday: day, shiftId: shifts[1].id, teacherId: teachers[1].id }));
  }
  await scheduleRepo.save(scheduleData);

  // 7. Seed Attendance (Last 3 months + today)
  process.stdout.write('Seeding Attendance (3 months history)...\n');
  const now = new Date();
  for (let monthOffset = 0; monthOffset < 3; monthOffset++) {
    const monthDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - monthOffset, 1));
    const year = monthDate.getUTCFullYear();
    const mon = monthDate.getUTCMonth();
    
    // Seed at least 2 sessions per week for each class in that month
    for (let day = 1; day <= 28; day += 3) {
      const d = new Date(Date.UTC(year, mon, day));
      const weekday = d.getUTCDay();
      if (weekday === 0 || weekday === 6) continue; // Skip weekends

      // For each class, find if there's a schedule on this weekday
      for (const cls of classes) {
        const matchingSchedules = scheduleData.filter(s => s.classId === cls.id && s.weekday === weekday);
        for (const schedule of matchingSchedules) {
          const dateStr = d.toISOString().split('T')[0];
          const session = await sessionRepo.save(sessionRepo.create({
            classId: cls.id,
            date: dateStr,
            shiftId: schedule.shiftId,
            teacherId: schedule.teacherId,
          }));

          const classStudents = students.filter(s => s.classId === cls.id);
          await recordRepo.save(classStudents.map(s => recordRepo.create({
            sessionId: session.id,
            studentId: s.id,
            status: Math.random() > 0.1 ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT,
          })));
        }
      }
    }
  }
  const class0Students = students.filter(s => s.classId === classes[0].id);

  // 8. Seed Homework
  process.stdout.write('Seeding Homework...\n');
  const homework = await homeworkRepo.save(homeworkRepo.create({
    title: 'Bài tập đa thức',
    description: 'Làm bài tập trang 45 sách giáo khoa',
    type: HomeworkType.ESSAY,
    dueAt: new Date(Date.now() + 86400000 * 3),
    classId: classes[0].id,
    teacherId: teachers[0].id,
    targetScope: HomeworkTargetScope.CLASS,
  }));

  // Targets automatically generated by trigger or service logic usually, but here we insert manually for seeding
  await targetRepo.save(class0Students.map((s: Student) => targetRepo.create({
    homeworkId: homework.id,
    studentId: s.id,
  })));

  // Submission for one student
  await submissionRepo.save(submissionRepo.create({
    homeworkId: homework.id,
    studentId: class0Students[0].id,
    parentId: class0Students[0].parentId,
    status: HomeworkSubmissionStatus.SUBMITTED,
    attachments: { url: 'https://example.com/homework.pdf' },
  }));

  // 9. Seed Assessments
  process.stdout.write('Seeding Assessments...\n');
  await assessmentRepo.save(class0Students.map((s: Student, idx: number) => assessmentRepo.create({
    studentId: s.id,
    courseId: courses[0].id,
    teacherId: teachers[0].id,
    ethicsScore: 8 + (idx % 2),
    wisdomScore: 7 + (idx % 3),
    willpowerScore: 9 - (idx % 2),
    comments: 'Cần cố gắng hơn nữa',
    assessmentDate: new Date(),
  })));

  // 10. Seed Salary Rates
  process.stdout.write('Seeding Salary Rates...\n');
  const salaryRates: TeacherSalaryRate[] = [];
  teachers.forEach((t, tIdx) => {
    shifts.forEach((s, sIdx) => {
      salaryRates.push(salaryRepo.create({
        teacherId: t.id,
        shiftId: s.id,
        amountPerSession: 200000 + (tIdx * 10000) + (sIdx * 5000), // Slightly different rates
      }));
    });
  });
  await salaryRepo.save(salaryRates);

  // 11. Seed Tuition Plans & Payments
  process.stdout.write('Seeding Tuition...\n');
  const plans = await planRepo.save(students.map(s => planRepo.create({
    studentId: s.id,
    monthlyFee: 5000000,
  })));

  await paymentRepo.save(students.slice(0, 5).map(s => paymentRepo.create({
    studentId: s.id,
    month: '2024-01',
    amount: 5000000,
    createdById: admin.id,
    method: 'Tiền mặt',
  })));

  await queryRunner.release();
  await dataSource.destroy();
  process.stdout.write('Seeding completed successfully!\n');
}

seed().catch((err: unknown) => {
  const message = err instanceof Error ? err.stack : String(err);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
