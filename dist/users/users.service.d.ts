import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersDto } from './dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    generateRandomCode(): string;
    create(createUserDto: UsersDto.CreateUserDto): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    update(userId: string, updateUserDto: UsersDto.UpdateUserDto): Promise<void>;
    findOneById(id: number): Promise<User>;
    findOneByIdUser(id: string): Promise<User>;
    remove(id: string): Promise<void>;
}
