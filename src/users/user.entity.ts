import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Order } from 'src/orders/order.entity';
import { Cart } from 'src/cart/entity/cart.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  role: string; // 'admin' or 'customer'

  @Column({ default: '' })
  profile: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
