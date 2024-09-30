import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from 'src/orders/order.entity';
import { Cart } from 'src/cart/entity/cart.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
  @ApiProperty({
    example: [
      {
        id: 1,
        status: 'pending',
        total: 100000,
        createdAt: new Date(),
        items: [],
        user: null,
        user_id: 1,
        description: 'isi dengan order anda',
        required: null,
        type: [Order],
      },
    ],
    description: 'isi dengan order anda',
    required: null,
    type: [Order],
  })
  orders: Order[];

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
