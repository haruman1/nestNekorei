import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderItem } from './order.entity';
import { OrdersDto } from './dto';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../products/products.service';
import { User } from 'src/users/user.entity';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,

    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,

    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}
  generateRandomCode(): string {
    const randomNumber = CryptoJS.lib.WordArray.random(4).toString(); // Menghasilkan angka acak (4 byte)
    const randomCode = `Nekorei-${randomNumber}`; // Gabungkan "NK" dengan angka acak
    return randomCode;
  }
  async createOrder(createOrderDto: OrdersDto.CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    const user = await this.usersService.findOneByIdUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productsService.findProductByProductId(
        item.productId.toString(),
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }
      const orderItem = this.orderItemsRepository.create({
        product: {
          id: product.id,
        },
        name: product.name,

        quantity: item.quantity,
        price: product.price * item.quantity,
      });
      orderItems.push(orderItem);
      total += orderItem.price;
    }

    const order = this.ordersRepository.create({
      user,
      orderId: this.generateRandomCode(),
      status: 'placed',
      total,
      items: orderItems,
    });

    return this.ordersRepository.save(order);
  }

  async findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['user', 'items', 'items.product'],
    });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: OrdersDto.UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }

  async removeOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.ordersRepository.remove(order);
  }
}
