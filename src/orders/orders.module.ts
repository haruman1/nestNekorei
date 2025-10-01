import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';

import { PaymentHistory } from 'src/payment/entity/paymentHistory.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    forwardRef(() => UsersModule), // Import the UsersModule
    ProductsModule,
    DatabaseModule,
  ],
  providers: [OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
