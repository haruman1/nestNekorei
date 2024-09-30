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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const users_service_1 = require("../users/users.service");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(ordersRepository, orderItemsRepository, usersService, productsService) {
        this.ordersRepository = ordersRepository;
        this.orderItemsRepository = orderItemsRepository;
        this.usersService = usersService;
        this.productsService = productsService;
    }
    async createOrder(createOrderDto) {
        const { userId, items } = createOrderDto;
        const missingFields = [];
        if (!userId) {
            missingFields.push('userId');
        }
        if (!items) {
            missingFields.push('items');
        }
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`Missing required fields: ${missingFields.join(', ')}`);
        }
        const user = await this.usersService.findOneById(userId);
        const orderItems = [];
        let total = 0;
        for (const item of items) {
            const product = await this.productsService.findProductById(item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${item.productId} not found`);
            }
            const orderItem = this.orderItemsRepository.create({
                product,
                quantity: item.quantity,
                price: product.price * item.quantity,
            });
            if (!orderItem.id) {
                missingFields.push('id');
            }
            if (!orderItem.quantity) {
                missingFields.push('quantity');
            }
            if (!orderItem.price) {
                missingFields.push('price');
            }
            orderItems.push(orderItem);
            total += orderItem.price;
        }
        if (orderItems.length === 0) {
            throw new common_1.BadRequestException('Order items cannot be empty');
        }
        const order = this.ordersRepository.create({
            user,
            status: 'placed',
            total,
            items: orderItems,
        });
        if (!order.items[0].id) {
            missingFields.push('items.id');
        }
        if (!order.items[0].quantity) {
            missingFields.push('items.quantity');
        }
        if (!order.items[0].price) {
            missingFields.push('items.price');
        }
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`The following fields are missing: ${missingFields.join(', ')}.`);
        }
        return this.ordersRepository.save(order);
    }
    async findAllOrders() {
        return this.ordersRepository.find({
            relations: ['user', 'items', 'items.product'],
        });
    }
    async findOrderById(id) {
        const order = await this.ordersRepository.findOne({
            where: { id },
            relations: ['user', 'items', 'items.product'],
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(id, updateOrderStatusDto) {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.status = updateOrderStatusDto.status;
        return this.ordersRepository.save(order);
    }
    async removeOrder(id) {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        await this.ordersRepository.remove(order);
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderItem)),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => users_service_1.UsersService))),
    __param(3, (0, common_1.Inject)((0, common_1.forwardRef)(() => products_service_1.ProductsService))),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map