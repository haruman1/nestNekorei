import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SecurityMiddleware } from './middleware/security.middleware';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';

import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './orders/orders.module';

import { ServeStaticModule } from '@nestjs/serve-static';

// import { PaymentController } from './payment/payment.controller';
// import { PaymentModule } from './payment/payment.module';

import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesModule } from './invoices/invoices.module';
import { CartModule } from './cart/cart.module';

import { SwaggerController } from './swagger.controller';
import { join } from 'path';
import { defaultDB, backupDB } from './database/mysql.provider';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CartModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,

    InvoicesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.CHECK_DASAR === 'development' ? '/' : '/swagger',
    }),
  ],
  providers: [
    { provide: 'DEFAULT_DB', useValue: defaultDB },
    { provide: 'BACKUP_DB', useValue: backupDB },
  ],
  exports: ['DEFAULT_DB', 'BACKUP_DB'],
  controllers: [InvoicesController, SwaggerController],
})
export class AppModule {}
