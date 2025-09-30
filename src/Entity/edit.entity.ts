import { ApiProperty } from '@nestjs/swagger';

export class EditEntity {
  @ApiProperty({ example: 200 })
  status: number;
  @ApiProperty({ example: 'This is a message' })
  message: string;
}
