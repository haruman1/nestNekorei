import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: any[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(payload: any): Promise<{
        id: number;
        email: string;
        name: string;
        password: string;
    }>;
}
export {};