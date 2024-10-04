import { Repository } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { OrdersDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private ordersRepository;
    private orderItemsRepository;
    private usersService;
    private productsService;
    constructor(ordersRepository: Repository<Order>, orderItemsRepository: Repository<OrderItem>, usersService: UsersService, productsService: ProductsService);
    generateRandomCode(): string;
    createOrder(createOrderDto: OrdersDto.CreateOrderDto): Promise<Order>;
    findAllOrders(): Promise<Order[]>;
    findOrderById(id: number): Promise<Order>;
    updateOrderStatus(id: number, updateOrderStatusDto: OrdersDto.UpdateOrderStatusDto): Promise<Order>;
    removeOrder(id: number): Promise<void>;
}
