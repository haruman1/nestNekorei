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

@Injectable()
export class PaymentService {
  private midtrans: MidtransClient;
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(PaymentHistory)
    private transactionRepository: Repository<PaymentHistory>,
  ) {
    // this.midtrans = new MidtransClient.Snap({
    //   isProduction: false,
    //   serverKey: process.env.MIDTRANS_SB_SERVER_KEY,
    //   clientKey: process.env.MIDTRANS_SB_CLIENT_KEY,
    // });
    // ERROR MALES FIX
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

  async verifyPayment(orderID: string, status: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId: orderID },
      relations: ['user', 'items'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (status === 'settlement') {
      await this.orderRepository.update(
        { orderId: order.orderId },
        { status: 'settlement' },
      );
    }
  }
  async transactionStatus(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId: orderId },
      relations: ['user', 'items'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    this.midtrans.transaction
      .status(order.orderId)
      .then((statusResponse) => {});
  }
  async PaymentTransaction(payload: any) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('Payload is empty or invalid');
    }

    this.transactionRepository.save({
      ...payload,
      order_Id: payload.order_id,
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

    return { message: 'success Masukkan data data' };
  }
  async paymentCheck(orderId: string) {
    const order = await this.orderRepository.findOne({
      where: { orderId: orderId },
      relations: ['user', 'items'],
    });
    const transaction = await this.transactionRepository.findOne({
      where: { order_id: order.orderId },
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }
    if (transaction.transaction_status === 'settlement') {
      await this.orderRepository.update(
        { orderId: order.orderId },
        { status: 'settlement' },
      );
    }
    if (transaction.transaction_status === 'deny') {
      await this.orderRepository.update(
        { orderId: order.orderId },
        { status: 'deny' },
      );
    }
    if (transaction.transaction_status === 'expire') {
      await this.orderRepository.update(
        { orderId: order.orderId },
        { status: 'expire' },
      );
    }
    return { messagePayment: 'Payment Status Updated' };
  }
}
