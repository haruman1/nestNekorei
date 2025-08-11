import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Cat Toy',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({
    description: 'Description of the product',
    example: 'A fun toy for cats',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '12345',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;
  @ApiProperty({
    description: 'Quantity of the product available',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
  @ApiProperty({
    description: 'Category ID of the product',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  categoryId?: number;
  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;
}
