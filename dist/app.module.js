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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./users/user.entity");
const product_entity_1 = require("./products/entity/product.entity");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const category_entity_1 = require("./products/entity/category.entity");
const order_entity_1 = require("./orders/order.entity");
const cart_entity_1 = require("./cart/entity/cart.entity");
const paymentHistory_entity_1 = require("./payment/entity/paymentHistory.entity");
function initDbFile(fileName) {
    const isVercel = !!process.env.VERCEL;
    let baseDir = isVercel ? '/tmp' : path.join(process.cwd(), 'data');
    const dbPath = path.join(baseDir, fileName);
    if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
    }
    if (!fs.existsSync(dbPath)) {
        fs.writeFileSync(dbPath, '');
        console.log(`🗄️ SQLite file dibuat: ${dbPath}`);
    }
    return dbPath;
}
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                name: 'default',
                type: 'sqlite',
                database: initDbFile('database.sqlite'),
                entities: [
                    cart_entity_1.Cart,
                    cart_entity_1.CartItem,
                    user_entity_1.User,
                    product_entity_1.Product,
                    category_entity_1.Category,
                    order_entity_1.Order,
                    order_entity_1.OrderItem,
                    product_entity_1.ProductImage,
                ],
                synchronize: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                name: 'backup',
                type: 'sqlite',
                database: initDbFile('backup.sqlite'),
                entities: [product_entity_1.ProductHistory, category_entity_1.CategoryHistory, paymentHistory_entity_1.PaymentHistory, user_entity_1.UserHistory],
                synchronize: true,
            }),
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map