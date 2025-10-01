import { forwardRef, Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => ProductsModule),
    DatabaseModule,
  ],
  providers: [CartService],
  controllers: [CartController],
  exports: [CartService],
})
export class CartModule {}
