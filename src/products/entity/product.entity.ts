import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from 'src/orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productId: string; // Make productId unique so it can be referenced

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  sku: string;

  @Column('int')
  quantity: number;

  // Many-to-One relation with Category
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  // One-to-Many relation with OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  // One-to-Many relation with ProductImage
}

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string; // Tidak lagi menjadi foreign key

  @Column()
  imageUrl: string;

  @Column()
  ImageId: string;
}

@Entity()
export class ProductHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  pesan: string;

  @Column()
  userId: string;

  @Column()
  createdAt: Date;
}
