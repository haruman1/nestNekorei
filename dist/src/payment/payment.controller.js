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
exports.PaymentController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const jwt_auth_guard_1 = require("../auth/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const create_transasction_dto_1 = require("./dto/create-transasction.dto");
let PaymentController = class PaymentController {
    constructor(paymentservice) {
        this.paymentservice = paymentservice;
    }
    createPayment(createPaymentDto) {
        return this.paymentservice.createPayment(createPaymentDto.orderId);
    }
    PaymentTransaction(payload) {
        return this.paymentservice.PaymentTransaction(payload);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('create'),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat sesi pembayaran untuk sebuah pesanan' }),
    (0, swagger_1.ApiBody)({ type: create_transasction_dto_1.createPaymentHitory }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Berhasil membuat sesi pembayaran (misal: redirect URL atau token Snap Midtrans).',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Order ID tidak ditemukan.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transasction_dto_1.createPaymentHitory]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Post)('history'),
    (0, swagger_1.ApiOperation)({
        summary: 'Endpoint untuk menerima notifikasi/webhook dari payment gateway',
        description: 'Endpoint ini tidak memerlukan otentikasi karena diakses oleh server payment gateway (misal: Midtrans).',
    }),
    (0, swagger_1.ApiBody)({
        description: 'Payload notifikasi dari payment gateway.',
        type: 'object',
        examples: {
            success: {
                summary: 'Contoh notifikasi sukses',
                value: {
                    transaction_time: '2023-10-27 14:00:00',
                    transaction_status: 'settlement',
                    order_id: 'ORD-20231027-001',
                    payment_type: 'qris',
                    gross_amount: '50000.00',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Notifikasi berhasil diterima dan diproses.',
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "PaymentTransaction", null);
exports.PaymentController = PaymentController = __decorate([
    (0, swagger_1.ApiTags)('Payment'),
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map