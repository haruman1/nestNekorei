import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersDto } from './dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';

import { JwtPayload } from '../auth/jwt/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  //masih salah validasi, harusnya email itu email. tapi huruf biasa tetap masuk
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.findOneByIdUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: Request & { user: JwtPayload },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.usersService.update(req.user.userId, updateUserDto);
    return this.usersService.findOneByIdUser(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request & { user: JwtPayload }) {
    await this.usersService.remove(req.user.userId);
    return { message: 'User profile successfully deleted' };
  }
  @UseGuards(JwtAuthGuard)
  @Post('image/auth')
  async ImageKit(@Req() req: Request & { user: JwtPayload }) {
    const user = await this.usersService.findOneByIdUser(req.user.userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.usersService.ImageKitAuth();
  }

  @UseGuards(JwtAuthGuard)
  @Post('konyol')
  async konyol(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.konyol(req.user.userId);
  }
}
