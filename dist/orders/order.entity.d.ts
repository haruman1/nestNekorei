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
    name: string;
    order: Order;
    product: Product;
    quantity: number;
    price: number;
}
