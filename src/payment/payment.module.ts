import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order, OrderItem } from '../orders/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentHistory } from './entity/paymentHistory.entity';

@Module({
  imports: [
    forwardRef(() => OrdersModule),
    TypeOrmModule.forFeature([Order, OrderItem, PaymentHistory]),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
