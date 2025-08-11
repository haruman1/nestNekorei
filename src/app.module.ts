import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { User, UserHistory } from './users/user.entity';
import {
  Product,
  ProductHistory,
  ProductImage,
} from './products/entity/product.entity';
import { Category, CategoryHistory } from './products/entity/category.entity';
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
import { SwaggerController } from './swagger.controller';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      name: 'default',
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
        ProductImage,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forRoot({
      name: 'backup',
      type: process.env.DATABASE_TYPE_BACKUP as any,
      host: process.env.DATABASE_HOST_BACKUP,
      port: parseInt(process.env.DATABASE_PORT_BACKUP), //kalau error hapus
      username: process.env.DATABASE_USERNAME_BACKUP,
      password: process.env.DATABASE_PASSWORD_BACKUP,
      database: process.env.DATABASE_NAME_BACKUP,
      entities: [ProductHistory, CategoryHistory, PaymentHistory, UserHistory],
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
  controllers: [PaymentController, InvoicesController, SwaggerController],
})
export class AppModule {}
