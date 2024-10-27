import { Column, PrimaryGeneratedColumn, OneToMany, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/orders/order.entity';
import { Cart } from 'src/cart/entity/cart.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty({
    example: 'NKXXXX',
  })
  userId: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'isi dengan email',
    required: true,
    type: String,
    title: 'Email User',
  })
  email: string;

  @Column()
  @ApiProperty({
    example: 'John Doe',
    description: 'isi dengan nama anda',
    required: true,
    type: String,
    title: 'Nama User',
  })
  name: string;

  @Column()
  @ApiProperty({
    example: '******',
    description: 'isi dengan password',
    required: true,
    type: String,
    title: 'Password User',
  })
  password: string;

  @Column()
  @ApiProperty({
    example: 'admin or customer',
    description: 'isi dengan role anda',
    required: true,
  })
  role: string; // 'admin' or 'customer'

  @Column({ default: '' })
  @ApiProperty({
    example: 'profile.jpg',
    description: 'isi dengan profile anda',
    required: null,
    type: String,
    title: 'Profile User',
  })
  profile: string;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
@Entity()
export class UserHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  pesan: string;

  @Column()
  userId: string;

  @Column()
  createdAt: Date;
}
