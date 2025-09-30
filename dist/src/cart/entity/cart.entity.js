"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = exports.Cart = void 0;
const openapi = require("@nestjs/swagger");
class Cart {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, userId: { required: true, type: () => String }, items: { required: true, type: () => [require("./cart.entity").CartItem] } };
    }
}
exports.Cart = Cart;
class CartItem {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => Number }, cartId: { required: true, type: () => Number }, productId: { required: true, type: () => String }, quantity: { required: true, type: () => Number } };
    }
}
exports.CartItem = CartItem;
//# sourceMappingURL=cart.entity.js.map