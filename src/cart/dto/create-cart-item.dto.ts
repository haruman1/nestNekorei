import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateCartItemDto {
  @ApiProperty({
    description: 'ID of the product to be added to the cart',
    example: '12345',
  })
  @IsNotEmpty()
  @IsString()
  productId: string;
  @ApiProperty({
    description: 'Quantity of the product to be added to the cart',
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
