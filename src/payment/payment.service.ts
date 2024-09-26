import {
  Injectable,
  Inject,
  BadRequestException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';

import * as MidtransClient from 'midtrans-client';
import { Snap } from 'midtrans-client';

@Injectable()
export class PaymentService {
  private midtrans: MidtransClient;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    // private // private orderRepository: Repository<Order>,
  ) {
    this.midtrans = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createPayment(orderID: number): Promise<Snap> {
    const order = await this.orderRepository.findOne({
      where: { id: orderID },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    const paymentOrder = await this.midtrans.createTransaction({
      transaction_details: {
        order_id: orderID,
        gross_amount: order.total,
      },
      item_details: [
        {
          id: 'Nekorei : ' + order.items[0].id,
          price: order.total,
          quantity: order.items[0].quantity,
          name: "Nekorei's " + order.items[0].name,
          merchant_name: 'Nekorei Management',
        },
      ],
    });
    return paymentOrder;
  }
}
