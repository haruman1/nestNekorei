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
import { ServeStaticModule } from '@nestjs/serve-static';
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
import path, { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.CHECK_DASAR === 'development' ? '/' : '/swagger',
    }),

    TypeOrmModule.forRoot({
      name: 'default',
      type: process.env.DATABASE_TYPE as any,
      // database: 'database.db',
      database: path.resolve(
        process.env.DATABASE_PATH || './data/database.sqlite',
      ),
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
      database: path.resolve(
        process.env.DATABASE_PATH_BACKUP || './data/backup.sqlite',
      ),
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
