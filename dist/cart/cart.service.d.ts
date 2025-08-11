import { Repository } from 'typeorm';
import { Cart, CartItem } from './entity/cart.entity';
import { CartDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
export declare class CartService {
    private cartRepository;
    private cartItemRepository;
    private usersService;
    private productsService;
    constructor(cartRepository: Repository<Cart>, cartItemRepository: Repository<CartItem>, usersService: UsersService, productsService: ProductsService);
    private findUserById;
    findOrCreateCart(userId: string): Promise<Cart>;
    addItem(userId: string, createCartItemDto: CartDto.CreateCartItemDto): Promise<Cart>;
    updateItem(userId: string, cartItemId: number, updateCartItemDto: CartDto.UpdateCartItemDto): Promise<Cart>;
    removeItem(userId: string, cartItemId: number): Promise<Cart>;
    getCartSummary(userId: string): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
}
