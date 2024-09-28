import { Order } from 'src/orders/order.entity';
import { Cart } from 'src/cart/entity/cart.entity';
export declare class User {
    id: number;
    email: string;
    name: string;
    password: string;
    role: string;
    profile: string;
    orders: Order[];
    carts: Cart[];
}
