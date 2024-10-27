import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Product,
  Category,
  ProductImage,
  ProductHistory,
  CategoryHistory,
} from './entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, ProductImage], 'default'),
    TypeOrmModule.forFeature([ProductHistory, CategoryHistory], 'backup'),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
