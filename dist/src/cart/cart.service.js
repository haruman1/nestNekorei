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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
let CartService = class CartService {
    constructor(usersService, productsService, defaultDb, backupDb) {
        this.usersService = usersService;
        this.productsService = productsService;
        this.defaultDb = defaultDb;
        this.backupDb = backupDb;
    }
    async findOrCreateCart(userId) {
        const [user] = await this.usersService.findOneByIdUser(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        let [cart] = await this.defaultDb.query('SELECT * FROM cart WHERE userId = ? LIMIT 1', [user.userId]);
        if (!cart) {
            await this.defaultDb.query('INSERT INTO cart (userId) VALUES (?)', [
                user.userId,
            ]);
            [cart] = await this.defaultDb.query('SELECT * FROM cart WHERE userId = ? LIMIT 1', [user.userId]);
            cart.items = [];
        }
        const items = await this.defaultDb.query(`SELECT ci.id, ci.cartId, ci.productId, ci.quantity, p.productId as product_productId, p.name as product_name, p.price as product_price
       FROM cart_item ci
       JOIN product p ON ci.productId = p.productId
       WHERE ci.cartId = ?`, [cart.id]);
        return {
            ...cart,
            items,
        };
    }
    async addCartItem(userId, createCartItemDto) {
        const cart = await this.findOrCreateCart(userId);
        const { productId, quantity } = createCartItemDto;
        const product = await this.productsService.findProductByProductId(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let [cartItem] = await this.defaultDb.query('SELECT * FROM cart_item WHERE cartId = ? AND productId = ? LIMIT 1', [cart.id, productId]);
        if (cartItem) {
            await this.defaultDb.query('UPDATE cart_item SET quantity = quantity + ? WHERE cartId = ? AND productId = ?', [quantity, cart.id, productId]);
            cartItem.quantity += quantity;
        }
        else {
            await this.defaultDb.query('INSERT INTO cart_item (cartId, productId, quantity) VALUES (?, ?, ?)', [cart.id, productId, quantity]);
            cartItem = {
                id: 0,
                cartId: cart.id,
                productId,
                quantity,
            };
            cart.items.push(cartItem);
        }
        const items = await this.defaultDb.query('SELECT * FROM cart_item WHERE cartId = ?', [cart.id]);
        cart.items = items;
        return cart;
    }
    async updateItem(userId, cartItemId, updateCartItemDto) {
        const cart = await this.findOrCreateCart(userId);
        const [cartItem] = await this.defaultDb.query('SELECT * FROM cart_item WHERE id = ? AND cartId = ? LIMIT 1', [cartItemId, cart.id]);
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.defaultDb.query('UPDATE cart_item SET quantity = ? WHERE id = ? AND cartId = ?', [updateCartItemDto.quantity, cartItemId, cart.id]);
        const items = await this.defaultDb.query('SELECT * FROM cart_item WHERE cartId = ?', [cart.id]);
        return {
            ...cart,
            items,
        };
    }
    async removeItem(userId, cartItemId) {
        const cart = await this.findOrCreateCart(userId);
        const [cartItem] = await this.defaultDb.query('SELECT * FROM cart_item WHERE id = ? AND cartId = ? LIMIT 1', [cartItemId, cart.id]);
        if (!cartItem) {
            throw new common_1.NotFoundException('Cart item not found');
        }
        await this.defaultDb.query('DELETE FROM cart_item WHERE id = ? AND cartId = ?', [cartItemId, cart.id]);
        const items = await this.defaultDb.query('SELECT * FROM cart_item WHERE cartId = ?', [cart.id]);
        return {
            ...cart,
            items,
        };
    }
    async getCartSummary(userId) {
        return this.findOrCreateCart(userId);
    }
    async clearCart(userId) {
        const cart = await this.findOrCreateCart(userId);
        await this.defaultDb.query('DELETE FROM cart_item WHERE cartId = ?', [
            cart.id,
        ]);
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => products_service_1.ProductsService))),
    __param(2, (0, common_1.Inject)('DEFAULT_DB')),
    __param(3, (0, common_1.Inject)('BACKUP_DB')),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        products_service_1.ProductsService, Object, Object])
], CartService);
//# sourceMappingURL=cart.service.js.map