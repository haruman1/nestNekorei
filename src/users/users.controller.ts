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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
// import { UsersDto } from './dto';
import { CreateUserDto, UpdateUserDto } from './dto';

import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiConflictResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { JwtPayload } from '../auth/jwt/jwt-payload.interface';
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: ' johndoe@example.com',
        userId: 'A512',
        createdAt: '2023-10-10T10:00:00.000Z',
        updatedAt: '2023-10-10T10:00:00.000Z',
      },
    },
  })
  @ApiConflictResponse({ description: 'User with this email already exists' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  //masih salah validasi, harusnya email itu email. tapi huruf biasa tetap masuk
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @ApiOperation({ summary: 'User login' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: ' johndoe@example.com' },
        password: { type: 'string', example: 'strongPassword123' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns JWT token',
    schema: {
      example: {
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return await this.authService.login(body.email, body.password);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: ' johndoe@example.com',
        userId: 'A512',
        createdAt: '2023-10-10T10:00:00.000Z',
        updatedAt: '2023-10-10T10:00:00.000Z',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.findOneByIdUser(req.user.userId);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user profile photo' })
  @ApiResponse({
    status: 200,
    description: 'Returns user profile photo URL',
    schema: {
      example: {
        photoUrl: 'https://example.com/path/to/profile-photo.jpg',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('photo')
  async getPhotoProfile(@Req() req: Request & { user: JwtPayload }) {
    return this.usersService.foto(req.user.userId);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully updated.',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: ' johndoe@example.com',
        userId: 'A512',
        createdAt: '2023-10-10T10:00:00.000Z',
        updatedAt: '2023-10-11T12:00:00.000Z',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: Request & { user: JwtPayload },
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(req.user.userId, updateUserDto);
  }
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete user profile' })
  @ApiResponse({
    status: 200,
    description: 'The user profile has been successfully deleted.',
  })
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
}
