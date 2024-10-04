import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';

import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
@UseGuards(JwtAuthGuard)
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentservice: PaymentService) {}

  @Post('create')
  createPayment(@Body() body: { orderID: string }) {
    return this.paymentservice.createPayment(body.orderID);
  }
  @Post('history')
  PaymentTransaction(@Body() payload: any) {
    return this.paymentservice.PaymentTransaction(payload);
  }
}
