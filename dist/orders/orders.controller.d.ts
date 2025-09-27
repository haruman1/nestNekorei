import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(createOrderDto: CreateOrderDto, req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface/order.interface").OrderResponse>;
    findAllOrders(): Promise<import("./order.entity").Order[]>;
    findOrderById(id: number): Promise<import("./order.entity").Order>;
    updateOrderStatus(id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./order.entity").Order>;
    removeOrder(id: number): Promise<void>;
}
