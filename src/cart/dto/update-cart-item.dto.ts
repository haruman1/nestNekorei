import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UpdateCartItemDto {
  @ApiProperty({
    description: 'Quantity of the product to be updated in the cart',
    example: 3,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}
