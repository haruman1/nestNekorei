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
import { PaymentHistory } from './entity/paymentHistory.entity';
import exp from 'constants';

@Injectable()
export class PaymentService {
  private midtrans: MidtransClient;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PaymentHistory)
    private transactionRepository: Repository<PaymentHistory>,
    // private // private orderRepository: Repository<Order>,
  ) {
    this.midtrans = new MidtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_PRD_SERVER_KEY,
      clientKey: process.env.MIDTRANS_PRD_CLIENT_KEY,
    });
  }

  async createPayment(orderID: string): Promise<Snap> {
    const order = await this.orderRepository.findOne({
      where: { orderId: orderID },
      relations: ['user', 'items'],
      // relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }
    try {
      const paymentOrder = await this.midtrans.createTransaction({
        transaction_details: {
          order_id: order.orderId,
          gross_amount: order.items[0].price * order.items[0].quantity,
        },
        customer_details: {
          first_name: 'Nekorei Customer ' + order.user.name,
          last_name: '',
          email: order.user.email,
          phone: '+628123456',
        },
        item_details: order.items.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.product.name,
        })),
      });
      return paymentOrder;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async PaymentTransaction(payload: any) {
    const order = await this.orderRepository.findOne({
      where: { orderId: payload.order_id },
      relations: ['user', 'items'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (payload.transaction_status === 'settlement') {
      await this.orderRepository.update(order.orderId, {
        status: 'settlement',
      });
    }
    if (payload.transaction_status === 'pending') {
      await this.orderRepository.update(order.orderId, {
        status: 'pending',
      });
    }
    this.transactionRepository.save({
      ...payload,
      order_Id: order.orderId,
      Merchant_Id: payload.merchant_id,
      time: payload.transaction_time,
      transaction_id: payload.transaction_id,
      transaction_status: payload.transaction_status,
      acquirer: payload.acquirer,
      expiry_time: payload.expiry_time,
      gross_amount: payload.gross_amount,
      payment_type: payload.payment_type, //echanel / qris / gopay
      status_message: payload.status_message,
    });
  }
}
