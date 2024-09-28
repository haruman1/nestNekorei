import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
export declare class AuthService {
    private usersService;
    private jwtService;
    private readonly jwtStrategy;
    constructor(usersService: UsersService, jwtService: JwtService, jwtStrategy: JwtStrategy);
    validateUser(email: string, pass: string): Promise<any>;
    login(email: string, password: string): Promise<{
        access_token: string;
    }>;
}
