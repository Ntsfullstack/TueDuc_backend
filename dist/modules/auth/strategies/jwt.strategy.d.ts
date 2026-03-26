import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '../../../common/enums/role.enum';
import { CurrentUserData } from '../../../common/decorators/current-user.decorator';
type JwtPayload = {
    sub: string;
    email: string;
    role: Role;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): CurrentUserData;
}
export {};
