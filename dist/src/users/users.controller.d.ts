import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';
export declare class UsersController {
    private readonly usersService;
    private readonly authService;
    constructor(usersService: UsersService, authService: AuthService);
    register(createUserDto: CreateUserDto): Promise<import("./entity").UserEntity>;
    login(body: {
        email: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
    getProfile(req: Request & {
        user: JwtPayload;
    }): Promise<any>;
    getPhotoProfile(req: Request & {
        user: JwtPayload;
    }): Promise<import("../Entity/edit.entity").EditEntity>;
    updateProfile(req: Request & {
        user: JwtPayload;
    }, updateUserDto: UpdateUserDto): Promise<import("../Entity/edit.entity").EditEntity>;
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
}
