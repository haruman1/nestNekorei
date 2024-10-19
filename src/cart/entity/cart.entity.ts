import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/entity/product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.carts) // Relasi ManyToOne antara Cart dan User
  @JoinColumn({ name: 'userId' }) // Foreign key (userId) di tabel Cart
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  items: CartItem[];
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.productId)
  product: Product;

  @Column('int')
  quantity: number;
}
