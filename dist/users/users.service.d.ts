import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interface/user-response.interface';
import { UsersDto } from './dto';
export declare class UsersService {
    private usersRepository;
    private imagekit;
    constructor(usersRepository: Repository<User>);
    generateRandomCode(): string;
    create(createUserDto: UsersDto.CreateUserDto): Promise<UserResponse>;
    ImageKitAuth(): Promise<{
        token: string;
        expire: number;
        signature: string;
    }>;
    konyol(userId: string): Promise<{
        message: string;
    }>;
    findOneByEmail(email: string): Promise<User>;
    update(userId: string, updateUserDto: UsersDto.UpdateUserDto): Promise<void>;
    findOneById(id: number): Promise<User>;
    findOneByIdUser(id: string): Promise<User>;
    remove(id: string): Promise<void>;
}
