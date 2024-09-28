import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(user: any, createCartItemDto: CreateCartItemDto): Promise<import("./entity/cart.entity").Cart>;
    updateItem(user: any, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<import("./entity/cart.entity").Cart>;
    removeItem(user: any, itemId: number): Promise<import("./entity/cart.entity").Cart>;
    getCartSummary(user: any): Promise<import("./entity/cart.entity").Cart>;
    checkout(user: any): Promise<{
        message: string;
    }>;
}
