import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entity';
import { EditEntity } from 'src/Entity/edit.entity';
export declare class UsersService {
    private imagekit;
    constructor();
    private generateUUID;
    create(createUserDto: CreateUserDto): Promise<UserEntity>;
    update(userId: string, updateUserDto: UpdateUserDto): Promise<EditEntity>;
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
