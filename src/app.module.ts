import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Category } from './products/category.entity';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';
import { Order, OrderItem } from './orders/order.entity';

import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentModule } from './payment/payment.module';
import { InvoicesService } from './invoices/invoices.service';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesModule } from './invoices/invoices.module';
import { CartModule } from './cart/cart.module';
import { Cart, CartItem } from './cart/entity/cart.entity';
import { PaymentHistory } from './payment/entity/paymentHistory.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_TYPE as any,
      // database: 'database.db',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT), //kalau error hapus
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [
        Cart,
        CartItem,
        User,
        Product,
        Category,
        Order,
        OrderItem,
        PaymentHistory,
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentModule,
    InvoicesModule,
    CartModule,
  ],
  providers: [PaymentService, InvoicesService],
  controllers: [PaymentController, InvoicesController],
})
export class AppModule {}
