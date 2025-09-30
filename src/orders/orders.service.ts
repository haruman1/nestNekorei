import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { OrdersDto } from './dto';
import * as CryptoJS from 'crypto-js';
import { ServerlessMysql } from 'serverless-mysql';
import { OrderEntity } from './entity';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DEFAULT_DB') private readonly defaultDb: ServerlessMysql,
    @Inject('BACKUP_DB') private readonly backupDb: ServerlessMysql,
  ) {}

  private generateRandomCode(): string {
    const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
    return `Nekorei-${randomNumber}`;
  }

  async createOrder(
    createOrderDto: OrdersDto.CreateOrderDto,
  ): Promise<OrderEntity> {
    const { userId, items } = createOrderDto;

    // Check user
    const [user] = await this.defaultDb.query<any[]>(
      'SELECT * FROM user WHERE userId = ?',
      [userId],
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderCode = this.generateRandomCode();
    let total = 0;

    // Insert order
    const result: any = await this.defaultDb.query(
      'INSERT INTO `order` (orderId, userId, status, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [orderCode, userId, 'placed', 0],
    );
    const orderId = result.insertId;

    // Insert items
    const insertedItems: Array<{
      id: number;
      productId: string;
      name: string;
      quantity: number;
      price: number;
    }> = [];
    for (const item of items) {
      const [product] = await this.defaultDb.query<any[]>(
        'SELECT * FROM product WHERE productId = ?',
        [item.productId],
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      const price = product.price * item.quantity;
      total += price;

      const itemResult: any = await this.defaultDb.query(
        'INSERT INTO order_item (orderId, productId, name, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [orderId, product.productId, product.name, item.quantity, price],
      );

      insertedItems.push({
        id: itemResult.insertId,
        productId: product.productId,
        name: product.name,
        quantity: item.quantity,
        price,
      });
    }

    // Update total
    await this.defaultDb.query(
      'UPDATE `order` SET total = ?, updatedAt = NOW() WHERE id = ?',
      [total, orderId],
    );

    // Ambil order final
    const [order] = await this.defaultDb.query<any[]>(
      'SELECT * FROM `order` WHERE id = ?',
      [orderId],
    );

    return {
      id: String(order.id),
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: insertedItems,
    };
  }

  async findAllOrders(): Promise<OrderEntity[]> {
    const orders: any[] = await this.defaultDb.query('SELECT * FROM `order`');
    const results: OrderEntity[] = [];

    for (const order of orders) {
      const items = await this.defaultDb.query<any[]>(
        'SELECT * FROM order_item WHERE orderId = ?',
        [order.id],
      );

      results.push({
        id: String(order.id),
        userId: order.userId,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items,
      });
    }

    return results;
  }

  async findOrderById(id: number): Promise<OrderEntity> {
    const [order] = await this.defaultDb.query<any[]>(
      'SELECT * FROM `order` WHERE id = ?',
      [id],
    );
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const items = await this.defaultDb.query<any[]>(
      'SELECT * FROM order_item WHERE orderId = ?',
      [id],
    );

    return {
      id: String(order.id),
      userId: order.userId,
      total: order.total,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items,
    };
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: OrdersDto.UpdateOrderStatusDto,
  ): Promise<OrderEntity> {
    await this.defaultDb.query(
      'UPDATE `order` SET status = ?, updatedAt = NOW() WHERE id = ?',
      [updateOrderStatusDto.status, id],
    );
    return this.findOrderById(id);
  }

  async removeOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.defaultDb.query('DELETE FROM order_item WHERE orderId = ?', [
      id,
    ]);
    await this.defaultDb.query('DELETE FROM `order` WHERE id = ?', [id]);
  }
}
