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

    // Validasi input
    if (!userId || !items || items.length === 0) {
      throw new BadRequestException('Missing required fields: userId or items');
    }

    // Cari user yang terkait
    const user = await this.usersService.findOneById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    // Buat pesanan terlebih dahulu
    const order = this.ordersRepository.create({
      user,
      status: 'placed',
      total: 0, // Total akan dihitung kemudian
    });

    // Loop untuk membuat OrderItem
    for (const item of items) {
      const product = await this.productsService.findProductById(
        item.productId,
      );
      if (!product) {
        throw new NotFoundException(
          `Product with ID ${item.productId} not found`,
        );
      }

      // Buat OrderItem dan kaitkan dengan Order
      const orderItem: OrderItem = this.orderItemsRepository.create({
        product: product.orderItems[0], // orderItems[0] adalah objek pertama dari array orderItems
        name: product.name,
        quantity: item.quantity,
        order: order,
      });

      // Simpan item ke dalam array
      orderItems.push(orderItem);
      total += product.price * item.quantity; // orderItem adalah objek individual
    }

    if (orderItems.length === 0) {
      throw new BadRequestException('Order items cannot be empty');
    }

    // Simpan dulu orderItem sebelum pesanan agar relasi sudah ada
    await this.orderItemsRepository.save(orderItems);

    // Update total order dan simpan order
    order.total = total;
    order.items = orderItems;
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
