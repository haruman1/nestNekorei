import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from 'src/orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  // Nama produk sebagai kolom biasa
  @Column()
  name: string;

  @Column('text')
  description: string;

  // Pastikan tipe data decimal memiliki presisi yang tepat
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  sku: string;

  @Column('int')
  quantity: number;

  // Relasi Many-to-One ke Category
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  // Relasi One-to-Many ke OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];
}
