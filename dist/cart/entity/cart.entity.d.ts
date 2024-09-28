import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
export declare class Cart {
    id: number;
    user: User;
    items: CartItem[];
}
export declare class CartItem {
    id: number;
    cart: Cart;
    product: Product;
    quantity: number;
}
