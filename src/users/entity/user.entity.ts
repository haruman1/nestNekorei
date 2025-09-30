import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    description: 'User unique identifier (auto-generated)',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    example: 'NKXXXX',
    description: 'isi dengan user id',
    required: true,
    type: String,
    title: 'User ID',
  })
  userId: string;

  @ApiProperty({
    description: 'isi dengan email',
    example: 'johndoe@example.com',
    required: true,
    type: String,
    title: 'Email User',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'isi dengan nama anda',
    required: true,
    type: String,
    title: 'Nama User',
  })
  name: string;

  @ApiProperty({
    example: '******',
    description: 'isi dengan password',
    required: true,
    type: String,
    title: 'Password User',
  })
  password: string;

  @ApiProperty({
    example: 'admin or customer',
    description: 'isi dengan role anda',
    required: true,
    type: String,
  })
  role: string;

  @ApiProperty({
    example: 'profile.jpg',
    description: 'isi dengan profile anda',
    required: false,
    type: String,
    title: 'Profile User',
  })
  profile: string;
}
