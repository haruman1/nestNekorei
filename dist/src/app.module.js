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
const security_middleware_1 = require("./middleware/security.middleware");
const users_module_1 = require("./users/users.module");
const auth_module_1 = require("./auth/auth.module");
const products_module_1 = require("./products/products.module");
const config_1 = require("@nestjs/config");
const orders_module_1 = require("./orders/orders.module");
const serve_static_1 = require("@nestjs/serve-static");
const payment_controller_1 = require("./payment/payment.controller");
const payment_module_1 = require("./payment/payment.module");
const invoices_controller_1 = require("./invoices/invoices.controller");
const invoices_module_1 = require("./invoices/invoices.module");
const cart_module_1 = require("./cart/cart.module");
const swagger_controller_1 = require("./swagger.controller");
const path_1 = require("path");
const mysql_provider_1 = require("./database/mysql.provider");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(security_middleware_1.SecurityMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            cart_module_1.CartModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            products_module_1.ProductsModule,
            orders_module_1.OrdersModule,
            payment_module_1.PaymentModule,
            invoices_module_1.InvoicesModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'swagger-static'),
                serveRoot: process.env.CHECK_DASAR === 'development' ? '/' : '/swagger',
            }),
        ],
        providers: [
            { provide: 'DEFAULT_DB', useValue: mysql_provider_1.defaultDB },
            { provide: 'BACKUP_DB', useValue: mysql_provider_1.backupDB },
        ],
        exports: ['DEFAULT_DB', 'BACKUP_DB'],
        controllers: [payment_controller_1.PaymentController, invoices_controller_1.InvoicesController, swagger_controller_1.SwaggerController],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map