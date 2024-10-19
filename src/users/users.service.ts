import {
  BadRequestException,
  forwardRef,
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserResponse } from './interface/user-response.interface';

import { UsersDto } from './dto';
import * as bcrypt from 'bcryptjs';

import ImageKit from 'imagekit';
@Injectable()
export class UsersService {
  private imagekit: ImageKit;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    const imageKit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
    this.imagekit = imageKit;
  }

  generateRandomCode(): string {
    const randomNumber = CryptoJS.lib.WordArray.random(4).toString(); // Menghasilkan angka acak (4 byte)
    const randomCode = `NK${randomNumber}`; // Gabungkan "NK" dengan angka acak
    return randomCode;
  }

  async create(createUserDto: UsersDto.CreateUserDto): Promise<UserResponse> {
    const { email, name, password, role } = createUserDto;

    // Log data yang diterima untuk debugging
    console.log('Data yang diterima:', createUserDto);

    // Validasi: pastikan semua field diisi
    if (!email || !password || !role) {
      throw new BadRequestException(
        'Maaf, data ada yang kosong. Silahkan lengkapi kembali.',
      );
    }

    // Cek apakah email sudah terdaftar
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException('Email already exists');
    }

    // Cek apakah username sudah terdaftar (misalnya username adalah email)

    const saltRounds = 10;
    try {
      // Hash password sebelum menyimpan ke database
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const UserID = this.generateRandomCode();
      // Buat user baru
      const user = this.usersRepository.create({
        userId: UserID,
        email,
        name,
        password: hashedPassword,
        role,
      });
      await this.usersRepository.save(user);
      // Simpan user ke database
      const response: UserResponse = {
        status: 200,
        data: 'User created successfully',
        dataUser: {
          id: user.userId,
          email: user.email,
          name: user.name,
        },
      };
      return response;
    } catch (err) {
      // Lempar error jika terjadi kesalahan dalam proses pembuatan user
      throw new BadRequestException('Error creating user: ' + err.message);
    }
  }

  async ImageKitAuth() {
    return this.imagekit.getAuthenticationParameters();
  }
  async konyol(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      message: 'yah, konyol',
    };
  }
  async findOneByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('Email must be provided222');
    }

    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) {
      console.log('User tidak ditemukan');
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    userId: string,
    updateUserDto: UsersDto.UpdateUserDto,
  ): Promise<void> {
    const { password, profile } = updateUserDto;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;
    await this.usersRepository.update(userId, {
      ...(password && { password: hashedPassword }),
      ...(profile && { profile }),
    });
  }
  async findOneById(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async findOneByIdUser(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { userId: id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
