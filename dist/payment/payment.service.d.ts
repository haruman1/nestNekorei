import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { Snap } from 'midtrans-client';
import { PaymentHistory } from './entity/paymentHistory.entity';
export declare class PaymentService {
    private orderRepository;
    private transactionRepository;
    private midtrans;
    constructor(orderRepository: Repository<Order>, transactionRepository: Repository<PaymentHistory>);
    createPayment(orderID: string): Promise<Snap>;
    verifyPayment(orderID: string, status: string): Promise<void>;
    transactionStatus(orderId: string): Promise<void>;
    PaymentTransaction(payload: any): Promise<{
        message: string;
    }>;
    paymentCheck(orderId: string): Promise<{
        messagePayment: string;
    }>;
}
