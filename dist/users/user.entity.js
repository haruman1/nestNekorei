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
exports.UserHistory = exports.User = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const order_entity_1 = require("../orders/order.entity");
const cart_entity_1 = require("../cart/entity/cart.entity");
let User = class User {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, userId: { required: true, type: () => String }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, password: { required: true, type: () => String }, role: { required: true, type: () => String }, profile: { required: true, type: () => String }, orders: { required: true, type: () => [require("../orders/order.entity").Order] }, carts: { required: true, type: () => [require("../cart/entity/cart.entity").Cart] } };
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        example: 'NKXXXX',
    }),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    (0, swagger_1.ApiProperty)({
        example: 'johndoe@example.com',
        description: 'isi dengan email',
        required: true,
        type: String,
        title: 'Email User',
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'isi dengan nama anda',
        required: true,
        type: String,
        title: 'Nama User',
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        example: '******',
        description: 'isi dengan password',
        required: true,
        type: String,
        title: 'Password User',
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, swagger_1.ApiProperty)({
        example: 'admin or customer',
        description: 'isi dengan role anda',
        required: true,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    (0, swagger_1.ApiProperty)({
        example: 'profile.jpg',
        description: 'isi dengan profile anda',
        required: null,
        type: String,
        title: 'Profile User',
    }),
    __metadata("design:type", String)
], User.prototype, "profile", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.user),
    __metadata("design:type", Array)
], User.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_entity_1.Cart, (cart) => cart.user),
    __metadata("design:type", Array)
], User.prototype, "carts", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)()
], User);
let UserHistory = class UserHistory {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, pesan: { required: true, type: () => String }, userId: { required: true, type: () => String }, createdAt: { required: true, type: () => Date } };
    }
};
exports.UserHistory = UserHistory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserHistory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserHistory.prototype, "pesan", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserHistory.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], UserHistory.prototype, "createdAt", void 0);
exports.UserHistory = UserHistory = __decorate([
    (0, typeorm_1.Entity)()
], UserHistory);
//# sourceMappingURL=user.entity.js.map