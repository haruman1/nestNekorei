import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { Order, OrderItem } from 'src/orders/order.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/entity/product.entity';
import { Category } from 'src/products/entity/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from 'src/products/products.module';
import { Cart, CartItem } from './entity/cart.entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ProductsModule,

    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      Order,
      OrderItem,
      User,
      Product,
      Category,
    ]),
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
