import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
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
    example: 'SecurepassWord123!#',
  })
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/, {
    message:
      'Password must be at least 6 characters long and contain both letters and numbers',
  })
  password: string;

  @ApiProperty({
    description: 'Role of the user',
    example: 'customer or admin',
  })
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  role: string; // 'admin' or 'customer'
}
