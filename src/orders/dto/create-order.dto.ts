import {
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  orderId: string;

  @IsArray()
  @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
