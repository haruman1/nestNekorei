import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("./user.entity").User>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: Request & {
        user: JwtPayload;
    }): Promise<import("./user.entity").User>;
    updateProfile(req: Request & {
        user: JwtPayload;
    }, updateUserDto: UpdateUserDto): Promise<import("./user.entity").User>;
    deleteProfile(req: Request & {
        user: JwtPayload;
    }): Promise<{
        message: string;
    }>;
}
export {};
