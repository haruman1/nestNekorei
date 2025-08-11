import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
  @ApiProperty({
    description: 'Update Unique identifier for the user',
    example: 1,
  })
  @IsOptional()
  @IsString()
  userId: string;
  @ApiProperty({
    description: 'Update Email address of the user',
    example: 'johndoe@example.com',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
  @ApiProperty({
    description: 'Update Profile information of the user',
    example: 'https://example.com/profile.jpg',
  })
  @IsOptional()
  @IsString()
  profile?: string;
  @ApiProperty({
    description: 'Update Name of the user',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    description: 'Update Role of the user',
    example: 'customer or admin',
  })
  @IsOptional()
  @IsString()
  role?: string;
}
