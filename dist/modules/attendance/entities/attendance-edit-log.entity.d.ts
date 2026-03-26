import { User } from '../../users/entities/user.entity';
import { AttendanceSession } from './attendance-session.entity';
export declare class AttendanceEditLog {
    id: string;
    session: AttendanceSession;
    sessionId: string;
    editor: User;
    editorId: string;
    reason: string | null;
    before: unknown;
    after: unknown;
    createdAt: Date;
}
