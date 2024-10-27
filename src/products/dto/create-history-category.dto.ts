import { IsNotEmpty, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateHistoryCategoryDto {
  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsNumber()
  pesan: number;

  @IsNotEmpty()
  @IsNumber()
  userId: string;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
