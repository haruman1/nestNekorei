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

  async createOrder(createOrderDto: OrdersDto.CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;
    const missingFields: string[] = [];
    if (!userId) {
      missingFields.push('userId');
    }
    if (!items) {
      missingFields.push('items');
    }

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Missing required fields: ${missingFields.join(', ')}`,
      );
    }

    const user = await this.usersService.findOneById(userId);

    const orderItems: OrderItem[] = [];

    let total = 0;

    for (const item of items) {
      const product = await this.productsService.findProductById(
        item.productId,
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }
      const orderItem = this.orderItemsRepository.create({
        product,
        quantity: item.quantity,
        price: product.price * item.quantity,
      });
      if (!orderItem.id) {
        missingFields.push('id');
      }
      if (!orderItem.quantity) {
        missingFields.push('quantity');
      }
      if (!orderItem.price) {
        missingFields.push('price');
      }

      orderItems.push(orderItem);
      total += orderItem.price;
    }
    if (orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }
    const order = this.ordersRepository.create({
      user,
      status: 'placed',
      total,
      items: orderItems,
    });
    if (!order.items[0].id) {
      missingFields.push('items.id');
    }
    if (!order.items[0].quantity) {
      missingFields.push('items.quantity');
    }
    if (!order.items[0].price) {
      missingFields.push('items.price');
    }
    if (missingFields.length > 0) {
      throw new BadRequestException(
        `The following fields are missing: ${missingFields.join(', ')}.`,
      );
    }
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
