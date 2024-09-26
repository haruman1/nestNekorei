import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { OneToMany } from 'typeorm';
import { OrderItem } from 'src/orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.name)
  name: string;

  @Column('text')
  description: string;

  @Column('decimal')
  price: number;

  @Column()
  sku: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
