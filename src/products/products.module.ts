import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entity';
import { Category } from './entity';
import { ProductImage } from './entity';
@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, ProductImage])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
