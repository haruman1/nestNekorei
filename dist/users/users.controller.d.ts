import { UsersService } from './users.service';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("./interface/user-response.interface").UserResponse>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: Request & {
        user: JwtPayload;
    }): Promise<import("./user.entity").User>;
    getPhotoProfile(req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface/user-response.interface").UserEditResponse>;
    updateProfile(req: Request & {
        user: JwtPayload;
    }, updateUserDto: UpdateUserDto): Promise<import("./interface/user-response.interface").UserEditResponse>;
    deleteProfile(req: Request & {
        user: JwtPayload;
    }): Promise<{
        message: string;
    }>;
    ImageKit(): Promise<{
        token: string;
        expire: number;
        signature: string;
    }>;
    UploadCare(req: Request & {
        user: JwtPayload;
    }): Promise<{
        secureSignature: string;
        secureExpire: string;
    }>;
    konyol(req: Request & {
        user: JwtPayload;
    }): Promise<{
        message: string;
    }>;
}
