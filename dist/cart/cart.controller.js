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
exports.CartController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const cart_service_1 = require("./cart.service");
const create_cart_item_dto_1 = require("./dto/create-cart-item.dto");
const update_cart_item_dto_1 = require("./dto/update-cart-item.dto");
const jwt_auth_guard_1 = require("../auth/jwt/jwt-auth.guard");
const current_user_decorator_1 = require("../auth/jwt/current-user.decorator");
let CartController = class CartController {
    constructor(cartService) {
        this.cartService = cartService;
    }
    addItem(user, createCartItemDto) {
        const userId = user.id;
        return this.cartService.addItem(userId, createCartItemDto);
    }
    updateItem(user, itemId, updateCartItemDto) {
        const userId = user.id;
        return this.cartService.updateItem(userId, itemId, updateCartItemDto);
    }
    removeItem(user, itemId) {
        const userId = user.id;
        return this.cartService.removeItem(userId, itemId);
    }
    getCartSummary(user) {
        const userId = user.id;
        return this.cartService.getCartSummary(userId);
    }
    async checkout(user) {
        const userId = user.id;
        const cart = await this.cartService.getCartSummary(userId);
        await this.cartService.clearCart(userId);
        return { message: 'Checkout successful' };
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)('add'),
    openapi.ApiResponse({ status: 201, type: require("./entity/cart.entity").Cart }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cart_item_dto_1.CreateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Patch)('update/:itemId'),
    openapi.ApiResponse({ status: 200, type: require("./entity/cart.entity").Cart }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, update_cart_item_dto_1.UpdateCartItemDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateItem", null);
__decorate([
    (0, common_1.Delete)('remove/:itemId'),
    openapi.ApiResponse({ status: 200, type: require("./entity/cart.entity").Cart }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Get)('summary'),
    openapi.ApiResponse({ status: 200, type: require("./entity/cart.entity").Cart }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCartSummary", null);
__decorate([
    (0, common_1.Post)('checkout'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartController.prototype, "checkout", null);
exports.CartController = CartController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map