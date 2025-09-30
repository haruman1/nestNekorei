"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEntity = void 0;
const openapi = require("@nestjs/swagger");
class OrderEntity {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, total: { required: true, type: () => Number }, status: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, items: { required: true, type: () => [({ id: { required: true, type: () => Number }, productId: { required: true, type: () => String }, name: { required: true, type: () => String }, quantity: { required: true, type: () => Number }, price: { required: true, type: () => Number } })] } };
    }
}
exports.OrderEntity = OrderEntity;
//# sourceMappingURL=order.entity.js.map