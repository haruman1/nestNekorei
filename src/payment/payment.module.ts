import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from '../orders/order.entity';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule, TypeOrmModule.forFeature([Order, OrderItem])],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
