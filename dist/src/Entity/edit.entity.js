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
exports.ReponseBiasa = exports.EditEntity = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
class EditEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, type: () => Number }, message: { required: true, type: () => String } };
    }
}
exports.EditEntity = EditEntity;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], EditEntity.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is a message' }),
    __metadata("design:type", String)
], EditEntity.prototype, "message", void 0);
class ReponseBiasa {
    static _OPENAPI_METADATA_FACTORY() {
        return { status: { required: true, type: () => Number }, message: { required: true, type: () => String }, data: { required: true, type: () => Object } };
    }
}
exports.ReponseBiasa = ReponseBiasa;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 200 }),
    __metadata("design:type", Number)
], ReponseBiasa.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'This is a message' }),
    __metadata("design:type", String)
], ReponseBiasa.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { key: 'value' } }),
    __metadata("design:type", Object)
], ReponseBiasa.prototype, "data", void 0);
//# sourceMappingURL=edit.entity.js.map