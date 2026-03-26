import { Student } from '../../students/entities/student.entity';
import { Course } from '../../courses/entities/course.entity';
import { User } from '../../users/entities/user.entity';
export declare class Assessment {
    id: string;
    student: Student;
    studentId: string;
    course: Course;
    courseId: string;
    teacher: User;
    teacherId: string;
    ethicsScore: number;
    wisdomScore: number;
    willpowerScore: number;
    comments: string;
    assessmentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
