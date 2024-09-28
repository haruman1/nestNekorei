import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UsersDto } from './dto';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(createUserDto: UsersDto.CreateUserDto): Promise<User>;
    findOneByEmail(email: string): Promise<User>;
    update(id: number, updateUserDto: UsersDto.UpdateUserDto): Promise<void>;
    findOneById(id: number): Promise<User>;
    remove(id: number): Promise<void>;
}
