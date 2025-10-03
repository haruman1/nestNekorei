import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Inject,
  ConflictException,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import * as bcrypt from 'bcryptjs';
import { generateSecureSignature } from '@uploadcare/signed-uploads';
import ImageKit from 'imagekit';
// import { queryDefault, queryBackup } from '../database/mysql.provider';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UserEntity } from './entity';

import {
  queryDefault,
  queryBackup,
  backupDB,
} from 'src/database/mysql.provider';
import { EditEntity } from 'src/Entity/edit.entity';

@Injectable()
export class UsersService {
  private imagekit: ImageKit;
  /**
   * Constructor for UsersService class
   *
   * @param {string} process.env.IMAGEKIT_PUBLIC_KEY - Public key for ImageKit
   * @param {string} process.env.IMAGEKIT_PRIVATE_KEY - Private key for ImageKit
   * @param {string} process.env.IMAGEKIT_URL_ENDPOINT - URL endpoint for ImageKit
   *
   * @param UserEntity - Entity representing a user
   * @param UserHistoryEntity - Entity representing user history
   */
  constructor() {
    // @Inject('BACKUP_DB') private readonly backupDb: ServerlessMysql, // @Inject('DEFAULT_DB') private readonly defaultDb: ServerlessMysql,
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }

  private async generateUUID(): Promise<string> {
    const { v4: uuidv4 } = await import('uuid');
    return uuidv4();
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { email, name, password, role } = createUserDto;
    if (!email || !password || !role || !name) {
      throw new BadRequestException(
        'Maaf, data ada yang kosong. Silahkan lengkapi kembali.',
      );
    }
    const existedEmail = await queryDefault<any>(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email],
    );
    if (existedEmail.length > 0) {
      throw new ConflictException('Email already exists');
    }
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      // generate UUID sekali, simpan
      const userId = await this.generateUUID();
      // Validasi: pastikan semua field diisi

      // simpan ke dua database
      await queryDefault(
        'INSERT INTO user (userId, email, password, name, role) VALUES (?, ?, ?, ?, ?)',
        [
          userId,
          createUserDto.email,
          hashedPassword,
          createUserDto.name,
          createUserDto.role,
        ],
      );

      await queryBackup(
        'INSERT INTO user_history (pesan, userId, createdAt) VALUES (?, ?, ?)',
        [
          `User created with ID: ${userId} and Name: ${createUserDto.name}`,
          userId,
          new Date(),
        ],
      );

      // langsung ambil user yang baru dibuat
      return await this.findOneByIdUser(userId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('User ID or Email already exists');
      }
      throw error;
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<EditEntity> {
    const [user] = await queryDefault<any>(
      'SELECT * FROM user WHERE userId = ?',
      [userId],
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let newPassword = user.password;
    if (
      updateUserDto.password &&
      !(await bcrypt.compare(updateUserDto.password, user.password))
    ) {
      newPassword = await bcrypt.hash(updateUserDto.password, 16);
    }

    await queryDefault(
      'UPDATE user SET password = ?, profile = ?, name = ? WHERE userId = ?',
      [
        newPassword,
        updateUserDto.profile || user.profile,
        updateUserDto.name || user.name,
        userId,
      ],
    );

    return { status: 200, message: `User Updated ${userId} Successfully` };
  }
  async remove(id_user: string): Promise<EditEntity> {
    await this.findOneByIdUser(id_user);
    await queryDefault('DELETE FROM user WHERE userId = ?', [id_user]);
    await queryBackup('DELETE FROM user_history WHERE userId = ?', [id_user]);
    return { status: 200, message: `User Deleted ${id_user} Successfully` };
  }
  async ImageKitAuth() {
    return this.imagekit.getAuthenticationParameters();
  }

  async UploadcareSignatureCreate() {
    const { secureSignature, secureExpire } = generateSecureSignature(
      process.env.UPLOADCARE_SECRET_KEYS,
      { expire: new Date('2025-01-01') },
    );
    return { secureSignature, secureExpire };
  }
  async foto(userId: string): Promise<EditEntity> {
    const [user] = await queryDefault(
      'SELECT profile FROM user WHERE userId = ?',
      [userId],
    );
    if (!user) {
      throw new NotFoundException('Sedang error, silahkan coba lagi');
    }
    return { status: 200, message: user.profile };
  }
  async findOneByEmail(email: string) {
    const results = await queryDefault<any>(
      'SELECT * FROM user WHERE email = ? LIMIT 1',
      [email],
    );
    if (!results || results.length === 0) {
      throw new NotFoundException('User not found');
    }
    return results[0];
  }

  async findOneById(id: number) {
    const [user] = await queryDefault<any>('SELECT * FROM user WHERE id = ?', [
      id,
    ]);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findOneByIdUser(id: string) {
    const [user] = await queryDefault<any>(
      'SELECT * FROM user WHERE userId = ? ',
      [id],
    );
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async forgotPassword(email: string) {
    const user = await this.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'If that email is registered, you will receive a reset link',
    };
    // bisa tambahin logic kirim email reset password
  }
}
