import { PaymentService } from './payment.service';
import { createPaymentHitory } from './dto/create-transasction.dto';
export declare class PaymentController {
    private readonly paymentservice;
    constructor(paymentservice: PaymentService);
    createPayment(createPaymentDto: createPaymentHitory): Promise<Snap>;
    PaymentTransaction(payload: any): Promise<{
        message: string;
    }>;
}
