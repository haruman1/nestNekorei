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
    findOrCreateCart(userId: number): Promise<Cart>;
    addItem(userId: number, createCartItemDto: CartDto.CreateCartItemDto): Promise<Cart>;
    updateItem(userId: number, cartItemId: number, updateCartItemDto: CartDto.UpdateCartItemDto): Promise<Cart>;
    removeItem(userId: number, cartItemId: number): Promise<Cart>;
    getCartSummary(userId: number): Promise<Cart>;
    clearCart(userId: number): Promise<void>;
}
