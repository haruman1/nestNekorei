"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const MidtransClient = __importStar(require("midtrans-client"));
const paymentHistory_entity_1 = require("./entity/paymentHistory.entity");
let PaymentService = class PaymentService {
    constructor(orderRepository, transactionRepository) {
        this.orderRepository = orderRepository;
        this.transactionRepository = transactionRepository;
        this.midtrans = new MidtransClient.Snap({
            isProduction: false,
            serverKey: process.env.MIDTRANS_SB_SERVER_KEY,
            clientKey: process.env.MIDTRANS_SB_CLIENT_KEY,
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
    async verifyPayment(orderID, status) {
        const order = await this.orderRepository.findOne({
            where: { orderId: orderID },
            relations: ['user', 'items'],
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (status === 'settlement') {
            await this.orderRepository.update({ orderId: order.orderId }, { status: 'settlement' });
        }
    }
    async transactionStatus(orderId) {
        const order = await this.orderRepository.findOne({
            where: { orderId: orderId },
            relations: ['user', 'items'],
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        this.midtrans.transaction
            .status(order.orderId)
            .then((statusResponse) => { });
    }
    async PaymentTransaction(payload) {
        if (!payload || Object.keys(payload).length === 0) {
            throw new common_1.BadRequestException('Payload is empty or invalid');
        }
        this.transactionRepository.save({
            ...payload,
            order_Id: payload.order_id,
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
        return { message: 'success Masukkan data data' };
    }
    async paymentCheck(orderId) {
        const order = await this.orderRepository.findOne({
            where: { orderId: orderId },
            relations: ['user', 'items'],
        });
        const transaction = await this.transactionRepository.findOne({
            where: { order_id: order.orderId },
        });
        if (!order) {
            throw new common_1.BadRequestException('Order not found');
        }
        if (!transaction) {
            throw new common_1.BadRequestException('Transaction not found');
        }
        if (transaction.transaction_status === 'settlement') {
            await this.orderRepository.update({ orderId: order.orderId }, { status: 'settlement' });
        }
        if (transaction.transaction_status === 'deny') {
            await this.orderRepository.update({ orderId: order.orderId }, { status: 'deny' });
        }
        if (transaction.transaction_status === 'expire') {
            await this.orderRepository.update({ orderId: order.orderId }, { status: 'expire' });
        }
        return { messagePayment: 'Payment Status Updated' };
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