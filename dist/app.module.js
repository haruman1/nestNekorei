"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const user_entity_1 = require("./users/user.entity");
const product_entity_1 = require("./products/entity/product.entity");
const category_entity_1 = require("./products/entity/category.entity");
const config_1 = require("@nestjs/config");
const orders_module_1 = require("./orders/orders.module");
const order_entity_1 = require("./orders/order.entity");
const payment_service_1 = require("./payment/payment.service");
const payment_controller_1 = require("./payment/payment.controller");
const payment_module_1 = require("./payment/payment.module");
const invoices_service_1 = require("./invoices/invoices.service");
const invoices_controller_1 = require("./invoices/invoices.controller");
const invoices_module_1 = require("./invoices/invoices.module");
const cart_module_1 = require("./cart/cart.module");
const cart_entity_1 = require("./cart/entity/cart.entity");
const paymentHistory_entity_1 = require("./payment/entity/paymentHistory.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'default',
                type: process.env.DATABASE_TYPE,
                host: process.env.DATABASE_HOST,
                port: parseInt(process.env.DATABASE_PORT),
                username: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME,
                entities: [
                    cart_entity_1.Cart,
                    cart_entity_1.CartItem,
                    user_entity_1.User,
                    product_entity_1.Product,
                    category_entity_1.Category,
                    order_entity_1.Order,
                    order_entity_1.OrderItem,
                    product_entity_1.ProductImage,
                ],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'backup',
                type: process.env.DATABASE_TYPE_BACKUP,
                host: process.env.DATABASE_HOST_BACKUP,
                port: parseInt(process.env.DATABASE_PORT_BACKUP),
                username: process.env.DATABASE_USERNAME_BACKUP,
                password: process.env.DATABASE_PASSWORD_BACKUP,
                database: process.env.DATABASE_NAME_BACKUP,
                entities: [product_entity_1.ProductHistory, category_entity_1.CategoryHistory, paymentHistory_entity_1.PaymentHistory, user_entity_1.UserHistory],
                synchronize: true,
            }),
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            payment_module_1.PaymentModule,
            invoices_module_1.InvoicesModule,
            cart_module_1.CartModule,
        ],
        providers: [payment_service_1.PaymentService, invoices_service_1.InvoicesService],
        controllers: [payment_controller_1.PaymentController, invoices_controller_1.InvoicesController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map