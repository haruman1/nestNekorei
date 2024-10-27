import { Repository } from 'typeorm';
import { User, UserHistory } from './user.entity';
import { UserEditResponse, UserResponse } from './interface/user-response.interface';
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';
export declare class UsersService {
    private usersRepository;
    private userHistoryRepository;
    private imagekit;
    constructor(usersRepository: Repository<User>, userHistoryRepository: Repository<UserHistory>);
    generateRandomCode(): string;
    create(createUserDto: CreateUserDto): Promise<UserResponse>;
    ImageKitAuth(): Promise<{
        token: string;
        expire: number;
        signature: string;
    }>;
    UploadcareSignatureCreate(): Promise<{
        secureSignature: string;
        secureExpire: string;
    }>;
    konyol(userId: string): Promise<{
        message: string;
    }>;
    findOneByEmail(email: string): Promise<User>;
    update(userId: string, updateUserDto: UpdateUserDto): Promise<UserEditResponse>;
    findOneById(id: number): Promise<User>;
    findOneByIdUser(id: string): Promise<User>;
    forgotPassword(email: string): Promise<void>;
    remove(id: string): Promise<void>;
}
