import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
export declare class Order {
    id: number;
    orderId: string;
    user: User;
    status: string;
    total: number;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItem[];
}
export declare class OrderItem {
    id: number;
    product: Product;
    name: string;
    quantity: number;
    price: number;
    order: Order;
}
