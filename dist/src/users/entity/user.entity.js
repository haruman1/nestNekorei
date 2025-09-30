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
exports.UserEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class UserEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, userId: { required: true, type: () => String }, email: { required: true, type: () => String }, name: { required: true, type: () => String }, password: { required: true, type: () => String }, role: { required: true, type: () => String }, profile: { required: true, type: () => String } };
    }
}
exports.UserEntity = UserEntity;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'User unique identifier (auto-generated)',
        example: 1,
        type: Number,
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'NKXXXX',
        description: 'isi dengan user id',
        required: true,
        type: String,
        title: 'User ID',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'isi dengan email',
        example: 'johndoe@example.com',
        required: true,
        type: String,
        title: 'Email User',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'John Doe',
        description: 'isi dengan nama anda',
        required: true,
        type: String,
        title: 'Nama User',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '******',
        description: 'isi dengan password',
        required: true,
        type: String,
        title: 'Password User',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'admin or customer',
        description: 'isi dengan role anda',
        required: true,
        type: String,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'profile.jpg',
        description: 'isi dengan profile anda',
        required: false,
        type: String,
        title: 'Profile User',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "profile", void 0);
//# sourceMappingURL=user.entity.js.map