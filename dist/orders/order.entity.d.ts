import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
export declare class Order {
    id: number;
    user: User;
    status: string;
    total: number;
    createdAt: Date;
    items: OrderItem[];
}
export declare class OrderItem {
    id: number;
    product: Product;
    name: string;
    quantity: number;
    order: Order;
}
