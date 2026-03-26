import { Role } from '../enums/role.enum';
export type CurrentUserData = {
    userId: string;
    email: string;
    role: Role;
};
export declare const CurrentUser: (...dataOrPipes: unknown[]) => ParameterDecorator;
