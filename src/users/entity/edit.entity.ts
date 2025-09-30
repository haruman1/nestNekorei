import { ApiProperty } from '@nestjs/swagger';
export class UserEditEntity {
  @ApiProperty({ example: 'A512' })
  userId: string;
  @ApiProperty({ example: 'John Doe' })
  name: string;
  @ApiProperty({ example: 'johndoe@example.com' })
  email: string;
  @ApiProperty({ example: 'https://example.com/profile.jpg' })
  profile: string;
}
