import { Order } from '../orders/order.entity';
import { Repository } from 'typeorm';
export declare class InvoicesService {
    private ordersRepository;
    constructor(ordersRepository: Repository<Order>);
    generateHeader(doc: any): Promise<void>;
    generateFooter(doc: any): Promise<void>;
    generateCustomerInformation(doc: any, invoice: any): Promise<void>;
    generateTableRow(doc: any, y: any, c1: any, c2: any, c3: any, c4: any, c5: any): Promise<void>;
    generateInvoiceTable(doc: any, invoice: any): Promise<void>;
    createInvoice(invoice: any, path: any): Promise<unknown>;
}
