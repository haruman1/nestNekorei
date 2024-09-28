import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Snap } from 'midtrans-client';
export declare class PaymentService {
    private orderRepository;
    private midtrans;
    constructor(orderRepository: Repository<Order>);
    createPayment(orderID: number): Promise<Snap>;
}
