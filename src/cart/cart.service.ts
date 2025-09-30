import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';

import { Cart, CartItem } from './entity/cart.entity';
import { CartDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { ServerlessMysql } from 'serverless-mysql';
import { queryDefault } from 'src/database/mysql.provider';

@Injectable()
export class CartService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
    @Inject('DEFAULT_DB') private readonly defaultDb: ServerlessMysql,
    @Inject('BACKUP_DB') private readonly backupDb: ServerlessMysql,
  ) {}

  // Helper function to find user

  // Find or create a cart for a specific user
  async findOrCreateCart(userId: string): Promise<Cart> {
    const [user] = await this.usersService.findOneByIdUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    let [cart] = await this.defaultDb.query<Cart[]>(
      'SELECT * FROM cart WHERE userId = ? LIMIT 1',
      [user.userId],
    );
    if (!cart) {
      await this.defaultDb.query('INSERT INTO cart (userId) VALUES (?)', [
        user.userId,
      ]);
      [cart] = await this.defaultDb.query<Cart[]>(
        'SELECT * FROM cart WHERE userId = ? LIMIT 1',
        [user.userId],
      );
      cart.items = [];
    }
    const items = await this.defaultDb.query<CartItem[]>(
      `SELECT ci.id, ci.cartId, ci.productId, ci.quantity, p.productId as product_productId, p.name as product_name, p.price as product_price
       FROM cart_item ci
       JOIN product p ON ci.productId = p.productId
       WHERE ci.cartId = ?`,
      [cart.id],
    );
    return {
      ...cart,
      items,
    };
  }

  // Add an item to the cart
  async addCartItem(
    userId: string,
    createCartItemDto: CartDto.CreateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);
    const { productId, quantity } = createCartItemDto;

    // cek product
    const product =
      await this.productsService.findProductByProductId(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // cari apakah item sudah ada di cart
    let [cartItem] = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE cartId = ? AND productId = ? LIMIT 1',
      [cart.id, productId],
    );

    if (cartItem) {
      // kalau ada → update quantity
      await this.defaultDb.query(
        'UPDATE cart_item SET quantity = quantity + ? WHERE cartId = ? AND productId = ?',
        [quantity, cart.id, productId],
      );
      cartItem.quantity += quantity;
    } else {
      // kalau belum ada → insert baru
      await this.defaultDb.query(
        'INSERT INTO cart_item (cartId, productId, quantity) VALUES (?, ?, ?)',
        [cart.id, productId, quantity],
      );

      // fallback object untuk response
      cartItem = {
        id: 0, // kalau auto increment biarkan 0
        cartId: cart.id,
        productId,
        quantity,
      };
      cart.items.push(cartItem);
    }

    // ambil ulang semua items supaya cart up-to-date
    const items = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE cartId = ?',
      [cart.id],
    );
    cart.items = items;

    return cart;
  }

  // Update the quantity of an item in the cart
  async updateItem(
    userId: string,
    cartItemId: number,
    updateCartItemDto: CartDto.UpdateCartItemDto,
  ): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);

    // pastikan item memang milik cart ini
    const [cartItem] = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE id = ? AND cartId = ? LIMIT 1',
      [cartItemId, cart.id],
    );

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // update quantity
    await this.defaultDb.query(
      'UPDATE cart_item SET quantity = ? WHERE id = ? AND cartId = ?',
      [updateCartItemDto.quantity, cartItemId, cart.id],
    );

    // ambil ulang semua item setelah update
    const items = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE cartId = ?',
      [cart.id],
    );

    return {
      ...cart,
      items,
    };
  }

  // Remove an item from the cart
  async removeItem(userId: string, cartItemId: number): Promise<Cart> {
    const cart = await this.findOrCreateCart(userId);

    // pastikan item ada & milik cart user
    const [cartItem] = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE id = ? AND cartId = ? LIMIT 1',
      [cartItemId, cart.id],
    );

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // hapus dari DB
    await this.defaultDb.query(
      'DELETE FROM cart_item WHERE id = ? AND cartId = ?',
      [cartItemId, cart.id],
    );

    // ambil ulang semua item setelah hapus
    const items = await this.defaultDb.query<CartItem[]>(
      'SELECT * FROM cart_item WHERE cartId = ?',
      [cart.id],
    );

    return {
      ...cart,
      items,
    };
  }

  // Get cart summary for a specific user
  async getCartSummary(userId: string): Promise<Cart> {
    return this.findOrCreateCart(userId);
  }

  // Clear all items from the cart
  async clearCart(userId: string): Promise<void> {
    const cart = await this.findOrCreateCart(userId);

    // hapus semua item di DB
    await this.defaultDb.query('DELETE FROM cart_item WHERE cartId = ?', [
      cart.id,
    ]);
  }
}
