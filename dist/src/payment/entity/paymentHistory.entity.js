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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistory = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let PaymentHistory = class PaymentHistory {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, transaction_type: { required: true, type: () => String }, transaction_time: { required: true, type: () => String }, transaction_status: { required: true, type: () => String }, transaction_id: { required: true, type: () => String }, status_message: { required: true, type: () => String }, status_code: { required: true, type: () => String }, signature_key: { required: true, type: () => String }, settlement_time: { required: true, type: () => String }, payment_type: { required: true, type: () => String }, order_id: { required: true, type: () => String }, merchant_id: { required: true, type: () => String }, issuer: { required: true, type: () => String }, gross_amount: { required: true, type: () => String }, fraud_status: { required: true, type: () => String }, acquirer: { required: true, type: () => String }, currency: { required: true, type: () => String } };
    }
};
exports.PaymentHistory = PaymentHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "transaction_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "transaction_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "transaction_status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "transaction_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "status_message", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "status_code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "signature_key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "settlement_time", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "payment_type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "order_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "merchant_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "issuer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "gross_amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "fraud_status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "acquirer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PaymentHistory.prototype, "currency", void 0);
exports.PaymentHistory = PaymentHistory = __decorate([
    (0, typeorm_1.Entity)()
], PaymentHistory);
//# sourceMappingURL=paymentHistory.entity.js.map