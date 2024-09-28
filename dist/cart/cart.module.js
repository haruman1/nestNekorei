"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartModule = void 0;
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const cart_controller_1 = require("./cart.controller");
const users_module_1 = require("../users/users.module");
const order_entity_1 = require("../orders/order.entity");
const user_entity_1 = require("../users/user.entity");
const product_entity_1 = require("../products/product.entity");
const category_entity_1 = require("../products/category.entity");
const typeorm_1 = require("@nestjs/typeorm");
const products_module_1 = require("../products/products.module");
const cart_entity_1 = require("./entity/cart.entity");
let CartModule = class CartModule {
};
exports.CartModule = CartModule;
exports.CartModule = CartModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => users_module_1.UsersModule),
            products_module_1.ProductsModule,
            typeorm_1.TypeOrmModule.forFeature([
                cart_entity_1.Cart,
                cart_entity_1.CartItem,
                order_entity_1.Order,
                order_entity_1.OrderItem,
                user_entity_1.User,
                product_entity_1.Product,
                category_entity_1.Category,
            ]),
        ],
        providers: [cart_service_1.CartService],
        controllers: [cart_controller_1.CartController],
        exports: [cart_service_1.CartService],
    })
], CartModule);
//# sourceMappingURL=cart.module.js.map