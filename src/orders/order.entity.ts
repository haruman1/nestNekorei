import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderId: string;

  // Relasi Many-to-One ke entitas User, tidak langsung ke field userId
  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  user: User;

  @Column()
  status: string; // 'placed', 'shipped', 'delivered', 'cancelled', 'returned'

  // Pastikan tipe data decimal diatur dengan panjang dan presisi
  @Column()
  total: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  // Relasi One-to-Many ke entitas OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items: OrderItem[];
}

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  // Relasi Many-to-One ke entitas Product
  @ManyToOne(() => Product, (product) => product.orderItems, { eager: true })
  product: Product;

  // Nama produk yang dipesan (sebagai salinan data dari Product entity)
  @Column()
  name: string;

  @Column()
  quantity: number;

  @Column()
  price: number;

  // Relasi Many-to-One ke entitas Order
  @ManyToOne(() => Order, (order) => order.items)
  order: Order;
}
