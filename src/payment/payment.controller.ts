import { Controller, Post, Body, Param, Req } from '@nestjs/common';

import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentservice: PaymentService) {}

  @Post('create')
  createPayment(@Body() body: { orderID: number }) {
    return this.paymentservice.createPayment(body.orderID);
  }
}
