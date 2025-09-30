import { ApiProperty } from '@nestjs/swagger';
export class UserHistoryEntity {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Pesan user' })
  pesan: string;

  @ApiProperty({ example: 'NKXXXX' })
  userId: string;

  @ApiProperty({ example: '2025-09-30T10:00:00Z' })
  createdAt: Date;
}
