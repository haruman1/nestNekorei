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
import * as path from 'path';
import * as fs from 'fs';
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
import { join } from 'path';

function initDbFile(fileName: string): string {
  const isVercel = !!process.env.VERCEL; // detect kalau di vercel
  let baseDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
  const dbPath = path.join(baseDir, fileName);

  // pastikan folder ada
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  // hanya bikin file kalau foldernya writable
  try {
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, '');
      console.log(`🗄️ SQLite file dibuat: ${dbPath}`);
    }
  } catch (err) {
    console.warn(
      `⚠️ Tidak bisa menulis file ${dbPath}, hanya read-only.`,
      err.message,
    );
  }

  return dbPath;
}

@Module({
  imports: [
    // Database utama
    TypeOrmModule.forRoot({
      name: 'default',
      type: 'sqlite',
      database: initDbFile('database.sqlite'),
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

    // Database backup
    TypeOrmModule.forRoot({
      name: 'backup',
      type: 'sqlite',
      database: initDbFile('backup.sqlite'),
      entities: [ProductHistory, CategoryHistory, PaymentHistory, UserHistory],
      synchronize: true,
    }),
  ],
})
export class AppModule {}

// 📦 Helper function
