import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Toys',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Category ID',
    example: 'cat123',
  })
  @IsNotEmpty()
  @IsString()
  categoryId: string;
  @ApiProperty({
    description: 'Description of image for the category',
    example: 'Image category for toys',
  })
  @IsNotEmpty()
  @IsString()
  image: string;
}
