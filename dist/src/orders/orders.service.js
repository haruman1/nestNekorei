"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = __importStar(require("crypto-js"));
let OrdersService = class OrdersService {
    constructor(defaultDb, backupDb) {
        this.defaultDb = defaultDb;
        this.backupDb = backupDb;
    }
    generateRandomCode() {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        return `Nekorei-${randomNumber}`;
    }
    async createOrder(createOrderDto) {
        const { userId, items } = createOrderDto;
        const [user] = await this.defaultDb.query('SELECT * FROM user WHERE userId = ?', [userId]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const orderCode = this.generateRandomCode();
        let total = 0;
        const result = await this.defaultDb.query('INSERT INTO `order` (orderId, userId, status, total, createdAt, updatedAt) VALUES (?, ?, ?, ?, NOW(), NOW())', [orderCode, userId, 'placed', 0]);
        const orderId = result.insertId;
        const insertedItems = [];
        for (const item of items) {
            const [product] = await this.defaultDb.query('SELECT * FROM product WHERE productId = ?', [item.productId]);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            const price = product.price * item.quantity;
            total += price;
            const itemResult = await this.defaultDb.query('INSERT INTO order_item (orderId, productId, name, quantity, price) VALUES (?, ?, ?, ?, ?)', [orderId, product.productId, product.name, item.quantity, price]);
            insertedItems.push({
                id: itemResult.insertId,
                productId: product.productId,
                name: product.name,
                quantity: item.quantity,
                price,
            });
        }
        await this.defaultDb.query('UPDATE `order` SET total = ?, updatedAt = NOW() WHERE id = ?', [total, orderId]);
        const [order] = await this.defaultDb.query('SELECT * FROM `order` WHERE id = ?', [orderId]);
        return {
            id: String(order.id),
            userId: order.userId,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items: insertedItems,
        };
    }
    async findAllOrders() {
        const orders = await this.defaultDb.query('SELECT * FROM `order`');
        const results = [];
        for (const order of orders) {
            const items = await this.defaultDb.query('SELECT * FROM order_item WHERE orderId = ?', [order.id]);
            results.push({
                id: String(order.id),
                userId: order.userId,
                total: order.total,
                status: order.status,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt,
                items,
            });
        }
        return results;
    }
    async findOrderById(id) {
        const [order] = await this.defaultDb.query('SELECT * FROM `order` WHERE id = ?', [id]);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        const items = await this.defaultDb.query('SELECT * FROM order_item WHERE orderId = ?', [id]);
        return {
            id: String(order.id),
            userId: order.userId,
            total: order.total,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            items,
        };
    }
    async updateOrderStatus(id, updateOrderStatusDto) {
        await this.defaultDb.query('UPDATE `order` SET status = ?, updatedAt = NOW() WHERE id = ?', [updateOrderStatusDto.status, id]);
        return this.findOrderById(id);
    }
    async removeOrder(id) {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.defaultDb.query('DELETE FROM order_item WHERE orderId = ?', [
            id,
        ]);
        await this.defaultDb.query('DELETE FROM `order` WHERE id = ?', [id]);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DEFAULT_DB')),
    __param(1, (0, common_1.Inject)('BACKUP_DB')),
    __metadata("design:paramtypes", [Object, Object])
], OrdersService);
//# sourceMappingURL=orders.service.js.map