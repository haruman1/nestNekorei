import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entity/cart.entity';
import { CartDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { User } from '../users/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,

    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  // Helper function to find user
  private async findUserById(userId: string): Promise<User> {
    const user = await this.usersService.findOneByIdUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Find or create a cart for a specific user
  async findOrCreateCart(userId: string): Promise<Cart> {
    const user = await this.findUserById(userId);
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = this.cartRepository.create({ user, items: [] });
      cart = await this.cartRepository.save(cart);
    }
    return cart;
  }

  // Add an item to the cart
  async addItem(
    userId: string,
    createCartItemDto: CartDto.CreateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const { productId, quantity } = createCartItemDto;
    const product =
      await this.productsService.findProductByProductId(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Find existing item in cart
    let cartItem = cart.items.find(
      (item) => item.product.productId === productId,
    );
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      cartItem = this.cartItemRepository.create({ cart, product, quantity });
      cart.items.push(cartItem);
    }

    await this.cartItemRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }

  // Update the quantity of an item in the cart
  async updateItem(
    userId: string,
    cartItemId: number,
    updateCartItemDto: CartDto.UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const cartItem = cart.items.find((item) => item.id === cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemRepository.save(cartItem);
    return this.cartRepository.save(cart);
  }

  // Remove an item from the cart
  async removeItem(userId: string, cartItemId: number): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const cartItemIndex = cart.items.findIndex(
      (item) => item.id === cartItemId,
    );

    if (cartItemIndex === -1) {
      throw new NotFoundException('Cart item not found');
    }

    const [cartItem] = cart.items.splice(cartItemIndex, 1);
    await this.cartItemRepository.remove(cartItem);
    return this.cartRepository.save(cart);
  }

  // Get cart summary for a specific user
  async getCartSummary(userId: string): Promise<Cart> {
    return this.findOrCreateCart(userId);
  }

  // Clear all items from the cart
  async clearCart(userId: string): Promise<void> {
    const cart = await this.findOrCreateCart(userId);
    await this.cartItemRepository.remove(cart.items);
    cart.items = [];
    await this.cartRepository.save(cart);
  }
}
