import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { CartModule } from 'src/cart/cart.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [forwardRef(() => CartModule), DatabaseModule],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
