import {
  Inject,
  forwardRef,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt/jwt.strategy';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    // Log untuk melihat email dan password yang diterima
    console.log('Validating user:', email, pass);
    const payload = { email, pass };
    const user = await this.jwtStrategy.validate(payload);

    if (!user) {
      console.log('User not found');
      return null;
    }

    // Cek apakah password cocok
    const isPasswordValid = await bcrypt.compare(pass, user.password);

    if (isPasswordValid) {
      // Return user tanpa password
      const { password, ...result } = user;
      return result;
    }

    console.log('Invalid password');
    return null;
  }

  async login(email: string, password: string) {
    // Validasi input
    if (!email || !password) {
      throw new BadRequestException('Email and password must be provided');
    }

    const user = await this.validateUser(email, password);
    console.log('user', user);

    // Validasi user
    if (!user) {
      throw new BadRequestException('Invalid email or password 1');
    }

    // Buat payload untuk JWT
    const payload = { email: user.email, sub: user.id, name: user.name };

    // Keluarkan token JWT
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
