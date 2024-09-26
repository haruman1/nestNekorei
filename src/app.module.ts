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

import { json } from 'body-parser';
import { PaymentService } from './payment/payment.service';
import { PaymentController } from './payment/payment.controller';
import { InvoiceController } from './invoice/invoice.controller';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data-ecommercenest.db',
      entities: [User, Product, Category, Order, OrderItem],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    PaymentModule,
  ],
  providers: [PaymentService],
  controllers: [PaymentController, InvoiceController],
})
export class AppModule {}
