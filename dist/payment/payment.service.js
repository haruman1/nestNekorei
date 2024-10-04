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
const paymentHistory_entity_1 = require("./entity/paymentHistory.entity");
let PaymentService = class PaymentService {
    constructor(orderRepository, transactionRepository) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.midtrans = new MidtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_PRD_SERVER_KEY,
            clientKey: process.env.MIDTRANS_PRD_CLIENT_KEY,
        });
    }
    async createPayment(orderID) {
        const order = await this.orderRepository.findOne({
            where: { orderId: orderID },
            relations: ['user', 'items'],
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        try {
            const paymentOrder = await this.midtrans.createTransaction({
                transaction_details: {
                    order_id: order.orderId,
                    gross_amount: order.items[0].price * order.items[0].quantity,
                },
                customer_details: {
                    first_name: 'Nekorei Customer ' + order.user.name,
                    last_name: '',
                    email: order.user.email,
                    phone: '+628123456',
                },
                item_details: order.items.map((item) => ({
                    id: item.id,
                    price: item.price,
                    quantity: item.quantity,
                    name: item.product.name,
                })),
            });
            return paymentOrder;
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async PaymentTransaction(payload) {
        const order = await this.orderRepository.findOne({
            where: { orderId: payload.order_id },
            relations: ['user', 'items'],
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (payload.transaction_status === 'settlement') {
            await this.orderRepository.update(order.orderId, {
                status: 'settlement',
            });
        }
        if (payload.transaction_status === 'pending') {
            await this.orderRepository.update(order.orderId, {
                status: 'pending',
            });
        }
        this.transactionRepository.save({
            ...payload,
            order_Id: order.orderId,
            Merchant_Id: payload.merchant_id,
            time: payload.transaction_time,
            transaction_id: payload.transaction_id,
            transaction_status: payload.transaction_status,
            acquirer: payload.acquirer,
            expiry_time: payload.expiry_time,
            gross_amount: payload.gross_amount,
            payment_type: payload.payment_type,
            status_message: payload.status_message,
        });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(paymentHistory_entity_1.PaymentHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentService);
//# sourceMappingURL=payment.service.js.map