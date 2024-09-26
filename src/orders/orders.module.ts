import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './order.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    forwardRef(() => UsersModule), // Import the UsersModule
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],

  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
