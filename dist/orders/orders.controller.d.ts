import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto): Promise<import("./order.entity").Order>;
    findAllOrders(): Promise<import("./order.entity").Order[]>;
    findOrderById(id: number): Promise<import("./order.entity").Order>;
    updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    removeOrder(id: number): Promise<void>;
}
