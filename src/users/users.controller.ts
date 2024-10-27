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
import { CreateUserDto } from './dto';
import { UpdateUserDto } from './dto';
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
    return await this.usersService.update(req.user.userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req: Request & { user: JwtPayload }) {
    await this.usersService.remove(req.user.userId);
    return { message: 'User profile successfully deleted' };
  }

  @Get('image/auth')
  async ImageKit() {
    return this.usersService.ImageKitAuth();
  }
  @Get('image/upload')
  async UploadCare(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.UploadcareSignatureCreate();
  }

  @UseGuards(JwtAuthGuard)
  @Post('konyol')
  async konyol(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.konyol(req.user.userId);
  }
}
