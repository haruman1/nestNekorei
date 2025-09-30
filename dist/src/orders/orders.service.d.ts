import { OrdersDto } from './dto';
import { ServerlessMysql } from 'serverless-mysql';
import { OrderEntity } from './entity';
export declare class OrdersService {
    private readonly defaultDb;
    private readonly backupDb;
    constructor(defaultDb: ServerlessMysql, backupDb: ServerlessMysql);
    private generateRandomCode;
    createOrder(createOrderDto: OrdersDto.CreateOrderDto): Promise<OrderEntity>;
    findAllOrders(): Promise<OrderEntity[]>;
    findOrderById(id: number): Promise<OrderEntity>;
    updateOrderStatus(id: number, updateOrderStatusDto: OrdersDto.UpdateOrderStatusDto): Promise<OrderEntity>;
    removeOrder(id: number): Promise<void>;
}
