import {
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';

import { Type } from 'class-transformer';

class OrderItemDto {
  @IsNotEmpty()
  @IsString()
  productId: String;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  userId: string;

  @IsArray()
  @ArrayNotEmpty()
  // @ValidateNested({ each: true })
  // @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
