import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'Name of the product',
    example: 'Cat Toy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({
    description: 'Description of the product',
    example: 'A fun toy for cats',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({
    description: 'Unique identifier for the product',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
  @ApiProperty({
    description: 'Price of the product',
    example: 19.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
  @ApiProperty({
    description: 'SKU (Stock Keeping Unit) of the product',
    example: 'SKU12345',
  })
  @IsNotEmpty()
  @IsString()
  sku: string;
  @ApiProperty({
    description: 'Quantity of the product available',
    example: 100,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @ApiProperty({
    description: 'Category ID of the product',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
  @ApiProperty({
    description: 'Image URL of the product',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsString()
  image: string;
  @ApiProperty({
    description: 'Image ID of the product',
    example: 'image12345',
  })
  @IsNotEmpty()
  @IsString()
  imageId: string;
}
