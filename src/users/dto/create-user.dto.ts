import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'User ID',
    example: 'A512',
  })
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 1,
    maxLength: 100,
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Password for the user account',
    example: 'securepassword123',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'customer or admin',
  })
  @IsNotEmpty()
  role: string; // 'admin' or 'customer'
}
