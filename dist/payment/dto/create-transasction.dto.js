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
exports.createPaymentHitory = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class createPaymentHitory {
    static _OPENAPI_METADATA_FACTORY() {
        return { orderId: { required: true, type: () => String }, transaction_Id: { required: true, type: () => String }, transaction_status: { required: true, type: () => String }, gross_amount: { required: true, type: () => String } };
    }
}
exports.createPaymentHitory = createPaymentHitory;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Order ID associated with the transaction',
        example: 'order_12345',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], createPaymentHitory.prototype, "orderId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment method used for the transaction',
        example: 'credit_card',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], createPaymentHitory.prototype, "transaction_Id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Payment Status of the transaction',
        example: 'success|failed|pending',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], createPaymentHitory.prototype, "transaction_status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Gross amount of the transaction',
        example: '100000',
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], createPaymentHitory.prototype, "gross_amount", void 0);
//# sourceMappingURL=create-transasction.dto.js.map