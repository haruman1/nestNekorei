import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateUserDto {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  @IsNotEmpty()
  id: number;
  @ApiProperty({
    description: 'User ID',
    example: 'A512',
  })
  @IsNotEmpty()
  userId: string;
  @ApiProperty({
    description: 'Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
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
