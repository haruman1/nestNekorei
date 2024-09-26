import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { Order } from 'src/orders/order.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin' or 'customer'

  @Column({ default: '' })
  profile: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
