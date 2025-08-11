import { Transaction } from 'typeorm';
import {
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class createPaymentHitory {
  @ApiProperty({
    description: 'Order ID associated with the transaction',
    example: 'order_12345',
  })
  @IsNotEmpty()
  @IsString()
  orderId: string;
  @ApiProperty({
    description: 'Payment method used for the transaction',
    example: 'credit_card',
  })
  @IsNotEmpty()
  transaction_Id: string;
  @ApiProperty({
    description: 'Payment Status of the transaction',
    example: 'success|failed|pending',
  })
  @IsNotEmpty()
  transaction_status: string;
  @ApiProperty({
    description: 'Gross amount of the transaction',
    example: '100000',
  })
  @IsNotEmpty()
  gross_amount: string;
}
export { createPaymentHitory };
