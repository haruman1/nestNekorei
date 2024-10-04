import { PaymentService } from './payment.service';
export declare class PaymentController {
    private readonly paymentservice;
    constructor(paymentservice: PaymentService);
    createPayment(body: {
        orderID: string;
    }): Promise<Snap>;
    PaymentTransaction(payload: any): Promise<void>;
}
