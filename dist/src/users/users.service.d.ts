import { UsersDto } from './dto';
import { UserEntity } from './entity';
import { ServerlessMysql } from 'serverless-mysql';
import { EditEntity } from 'src/Entity/edit.entity';
export declare class UsersService {
    private readonly defaultDb;
    private readonly backupDb;
    private imagekit;
    constructor(defaultDb: ServerlessMysql, backupDb: ServerlessMysql);
    generateRandomCode(): string;
    create(createUserDto: UsersDto.CreateUserDto): Promise<UserEntity>;
    update(userId: string, updateUserDto: UsersDto.UpdateUserDto): Promise<EditEntity>;
    remove(id_user: string): Promise<EditEntity>;
    ImageKitAuth(): Promise<{
        token: string;
        expire: number;
        signature: string;
    }>;
    UploadcareSignatureCreate(): Promise<{
        secureSignature: string;
        secureExpire: string;
    }>;
    foto(userId: string): Promise<EditEntity>;
    findOneByEmail(email: string): Promise<any>;
    findOneById(id: number): Promise<any>;
    findOneByIdUser(id: string): Promise<any>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
}
