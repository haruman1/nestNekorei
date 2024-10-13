import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';

import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from './order.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

import { PaymentHistory } from 'src/payment/entity/paymentHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, PaymentHistory]),
    forwardRef(() => UsersModule), // Import the UsersModule
    ProductsModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
