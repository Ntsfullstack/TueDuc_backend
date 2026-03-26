import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export type CurrentUserData = {
  userId: string;
  email: string;
  role: Role;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): CurrentUserData => {
    const request = ctx.switchToHttp().getRequest<{ user?: CurrentUserData }>();
    if (!request.user) {
      throw new Error('Current user is missing on request');
    }
    return request.user;
  },
);
