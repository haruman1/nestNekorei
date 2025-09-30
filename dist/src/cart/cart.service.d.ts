import { Cart } from './entity/cart.entity';
import { CartDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { ServerlessMysql } from 'serverless-mysql';
export declare class CartService {
    private usersService;
    private productsService;
    private readonly defaultDb;
    private readonly backupDb;
    constructor(usersService: UsersService, productsService: ProductsService, defaultDb: ServerlessMysql, backupDb: ServerlessMysql);
    findOrCreateCart(userId: string): Promise<Cart>;
    addCartItem(userId: string, createCartItemDto: CartDto.CreateCartItemDto): Promise<Cart>;
    updateItem(userId: string, cartItemId: number, updateCartItemDto: CartDto.UpdateCartItemDto): Promise<Cart>;
    removeItem(userId: string, cartItemId: number): Promise<Cart>;
    getCartSummary(userId: string): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
}
