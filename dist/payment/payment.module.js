"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_controller_1 = require("./payment.controller");
const payment_service_1 = require("./payment.service");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("../orders/order.entity");
const orders_module_1 = require("../orders/orders.module");
const paymentHistory_entity_1 = require("./entity/paymentHistory.entity");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => orders_module_1.OrdersModule),
            typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order, order_entity_1.OrderItem, paymentHistory_entity_1.PaymentHistory]),
        ],
        providers: [payment_service_1.PaymentService],
        controllers: [payment_controller_1.PaymentController],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map