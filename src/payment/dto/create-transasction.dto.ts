import { Transaction } from 'typeorm';
import {
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

class createPaymentHitory {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  transaction_Id: string;

  @IsNotEmpty()
  transaction_status: string;

  @IsNotEmpty()
  gross_amount: string;
}
