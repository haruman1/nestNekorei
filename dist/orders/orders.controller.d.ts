import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
interface JwtPayload {
    userId: string;
    name: string;
    email: string;
}
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto, req: Request & {
        user: JwtPayload;
    }): Promise<import("./order.entity").Order>;
    findAllOrders(): Promise<import("./order.entity").Order[]>;
    findOrderById(id: number): Promise<import("./order.entity").Order>;
    updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    removeOrder(id: number): Promise<void>;
}
export {};
