"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
const MidtransClient = require("midtrans-client");
let PaymentService = class PaymentService {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
        this.midtrans = new MidtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SERVER_KEY,
            clientKey: process.env.MIDTRANS_CLIENT_KEY,
        });
    }
    async createPayment(orderID) {
        const order = await this.orderRepository.findOne({
            where: { id: orderID },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        const paymentOrder = await this.midtrans.createTransaction({
            transaction_details: {
                order_id: orderID,
                gross_amount: order.total,
            },
            item_details: [
                {
                    id: 'Nekorei : ' + order.items[0].id,
                    price: order.total,
                    quantity: order.items[0].quantity,
                    name: "Nekorei's " + order.items[0].name,
                    merchant_name: 'Nekorei Management',
                },
            ],
        });
        return paymentOrder;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map