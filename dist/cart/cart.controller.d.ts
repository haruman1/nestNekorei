import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    addItem(req: Request & {
        user: JwtPayload;
    }, createCartItemDto: CreateCartItemDto): Promise<import("./entity/cart.entity").Cart>;
    updateItem(req: Request & {
        user: JwtPayload;
    }, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<import("./entity/cart.entity").Cart>;
    removeItem(req: Request & {
        user: JwtPayload;
    }, itemId: number): Promise<import("./entity/cart.entity").Cart>;
    getCartSummary(req: Request & {
        user: JwtPayload;
    }): Promise<import("./entity/cart.entity").Cart>;
    checkout(req: Request & {
        user: JwtPayload;
    }): Promise<{
        message: string;
    }>;
}
