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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const CryptoJS = __importStar(require("crypto-js"));
let ProductsService = class ProductsService {
    constructor(defaultDb, backupDb) {
        this.defaultDb = defaultDb;
        this.backupDb = backupDb;
    }
    generateRandomCode(prefix) {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        return `${prefix}-${randomNumber}`;
    }
    async generateUUID() {
        const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
        return uuidv4();
    }
    async createProduct(createProductDto, CategoryId, userId) {
        const { productId, name, description, price, sku, quantity, image, imageId, } = createProductDto;
        const [category] = await this.defaultDb.query('SELECT * FROM category WHERE categoryId = ? LIMIT 1', [CategoryId]);
        if (!category) {
            throw new common_1.BadRequestException('Kategori belum dipilih / tidak ditemukan');
        }
        const [existing] = await this.defaultDb.query('SELECT productId FROM product WHERE productId = ? LIMIT 1', [productId]);
        if (existing) {
            throw new common_1.ConflictException('Product ID sudah ada');
        }
        await this.defaultDb.query(`INSERT INTO product
       (productId, name, description, price, sku, quantity, categoryId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`, [productId, name, description, price, sku, quantity, CategoryId]);
        const imgId = imageId || this.generateUUID();
        await this.defaultDb.query(`INSERT INTO product_image (ImageId, productId, imageUrl, createdAt)
       VALUES (?, ?, ?, NOW())`, [imgId, productId, image]);
        await this.backupDb.query(`INSERT INTO product_history (productId, pesan, userId, createdAt)
       VALUES (?, ?, ?, NOW())`, [
            productId,
            `Product dibuat oleh ${userId} pada ${new Date().toISOString()} dengan imageId ${imgId}`,
            userId,
        ]);
        const product = {
            id: productId,
            name,
            description,
            price,
            sku,
            quantity,
            categoryId: CategoryId,
            image,
        };
        return product;
    }
    async findAllProducts() {
        const rows = await this.defaultDb.query(`SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity,
              p.categoryId, i.imageUrl
       FROM product p
       LEFT JOIN (
         SELECT productId, imageUrl
         FROM product_image
         GROUP BY productId
       ) i ON i.productId = p.productId`);
        const data = rows.map((r) => ({
            id: r.productId,
            productId: r.productId,
            name: r.name,
            description: r.description,
            price: Number(r.price),
            sku: r.sku,
            quantity: Number(r.quantity),
            categoryId: r.categoryId || null,
            image: r.imageUrl || null,
        }));
        return {
            status: 200,
            data,
        };
    }
    async findProductByProductId(id) {
        const [row] = await this.defaultDb.query(`SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity,
              p.categoryId, i.imageUrl
       FROM product p
       LEFT JOIN (
         SELECT productId, imageUrl
         FROM product_image
         WHERE productId = ?
         LIMIT 1
       ) i ON i.productId = p.productId
       WHERE p.productId = ?
       LIMIT 1`, [id, id]);
        if (!row) {
            throw new common_1.NotFoundException('Product not found');
        }
        const product = {
            id: row.productId,
            name: row.name,
            description: row.description,
            price: Number(row.price),
            sku: row.sku,
            quantity: Number(row.quantity),
            categoryId: row.categoryId || null,
            image: row.imageUrl || null,
        };
        return product;
    }
    async updateProduct(id, updateProductDto, userId) {
        const product = await this.findProductByProductId(id);
        if (!product) {
            throw new common_1.BadRequestException('Produk tidak ditemukan');
        }
        if (updateProductDto.categoryId) {
            const [cat] = await this.defaultDb.query('SELECT * FROM category WHERE categoryId = ? LIMIT 1', [updateProductDto.categoryId]);
            if (!cat) {
                return {
                    status: 400,
                    message: 'Kategori tidak ada, gunakan kategori yang tersedia',
                };
            }
        }
        const fields = [];
        const values = [];
        if (updateProductDto.name !== undefined) {
            fields.push('name = ?');
            values.push(updateProductDto.name);
        }
        if (updateProductDto.description !== undefined) {
            fields.push('description = ?');
            values.push(updateProductDto.description);
        }
        if (updateProductDto.price !== undefined) {
            fields.push('price = ?');
            values.push(updateProductDto.price);
        }
        if (updateProductDto.sku !== undefined) {
            fields.push('sku = ?');
            values.push(updateProductDto.sku);
        }
        if (updateProductDto.quantity !== undefined) {
            fields.push('quantity = ?');
            values.push(updateProductDto.quantity);
        }
        if (updateProductDto.categoryId !== undefined) {
            fields.push('categoryId = ?');
            values.push(updateProductDto.categoryId);
        }
        if (fields.length > 0) {
            const sql = `UPDATE product SET ${fields.join(', ')}, updatedAt = NOW() WHERE productId = ?`;
            values.push(id);
            await this.defaultDb.query(sql, values);
        }
        if (updateProductDto.image) {
            const [img] = await this.defaultDb.query('SELECT * FROM product_image WHERE productId = ? LIMIT 1', [id]);
            if (img) {
                await this.defaultDb.query('UPDATE product_image SET imageUrl = ?, updatedAt = NOW() WHERE productId = ?', [updateProductDto.image, id]);
            }
            else {
                const { v4: uuidv4 } = await Promise.resolve().then(() => __importStar(require('uuid')));
                const newImgId = uuidv4() || this.generateRandomCode('IMG');
                await this.defaultDb.query('INSERT INTO product_image (ImageId, productId, imageUrl, createdAt) VALUES (?, ?, ?, NOW())', [newImgId, id, updateProductDto.image]);
            }
        }
        await this.backupDb.query('INSERT INTO product_history (productId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())', [
            id,
            `Product diperbarui oleh ${userId} pada ${new Date().toISOString()}`,
            userId,
        ]);
        return {
            status: 200,
            message: `Produk dengan ID ${id} berhasil diperbarui`,
        };
    }
    async removeProduct(id) {
        const [prod] = await this.defaultDb.query('SELECT * FROM product WHERE productId = ? LIMIT 1', [id]);
        if (!prod) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.defaultDb.query('DELETE FROM product_image WHERE productId = ?', [id]);
        await this.defaultDb.query('DELETE FROM product WHERE productId = ?', [id]);
        await this.backupDb.query('INSERT INTO product_history (productId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())', [id, `Product dihapus pada ${new Date().toISOString()}`, 'system']);
        return { status: 200, message: `Produk dengan ID ${id} berhasil dihapus` };
    }
    async createCategory(createCategoryDto, userid) {
        createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
        if (!createCategoryDto.name ||
            !createCategoryDto.categoryId ||
            !createCategoryDto.image) {
            throw new common_1.BadRequestException('Name, categoryId and image are required');
        }
        const [existing] = await this.defaultDb.query('SELECT * FROM category WHERE name = ? LIMIT 1', [createCategoryDto.name]);
        if (existing) {
            throw new common_1.ConflictException('Category already exists');
        }
        await this.defaultDb.query('INSERT INTO category (categoryId, name, image, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())', [
            createCategoryDto.categoryId,
            createCategoryDto.name,
            createCategoryDto.image,
        ]);
        await this.backupDb.query('INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())', [
            createCategoryDto.categoryId,
            `Category dibuat oleh ${userid} pada ${new Date().toISOString()}`,
            userid,
        ]);
        return {
            status: 201,
            data: [
                {
                    id: createCategoryDto.categoryId,
                    name: createCategoryDto.name,
                    image: createCategoryDto.image,
                },
            ],
        };
    }
    async findAllCategoriesNew() {
        const rows = await this.defaultDb.query('SELECT * FROM category ORDER BY name ASC');
        const data = rows.map((r) => ({
            id: r.categoryId,
            name: r.name,
            image: r.image,
        }));
        return { status: 200, data };
    }
    async findCategoryById(id) {
        const [row] = await this.defaultDb.query('SELECT * FROM category WHERE categoryId = ? LIMIT 1', [id]);
        if (!row) {
            throw new common_1.NotFoundException('Category not found');
        }
        return { id: row.categoryId, name: row.name, image: row.image };
    }
    async updateCategory(id, updateCategoryDto, userid) {
        const [existing] = await this.defaultDb.query('SELECT * FROM category WHERE categoryId = ? LIMIT 1', [id]);
        if (!existing) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.defaultDb.query('UPDATE category SET name = ?, image = ?, updatedAt = NOW() WHERE categoryId = ?', [
            updateCategoryDto.name || existing.name,
            updateCategoryDto.image || existing.image,
            id,
        ]);
        await this.backupDb.query('INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())', [
            id,
            `Category diperbarui oleh ${userid} pada ${new Date().toISOString()}`,
            userid,
        ]);
        return {
            status: 200,
            message: `Kategori dengan ID ${id} berhasil diperbarui`,
        };
    }
    async removeCategory(id, userId) {
        const [existing] = await this.defaultDb.query('SELECT * FROM category WHERE categoryId = ? LIMIT 1', [id]);
        if (!existing) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.defaultDb.query('DELETE FROM category WHERE categoryId = ?', [
            id,
        ]);
        await this.backupDb.query('INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())', [
            id,
            `Category dihapus oleh ${userId} pada ${new Date().toISOString()}`,
            userId,
        ]);
        return {
            status: 200,
            message: `Kategori dengan ID ${id} berhasil dihapus`,
        };
    }
    async searchProducts(query) {
        const rows = await this.defaultDb.query('SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity, i.imageUrl FROM product p LEFT JOIN product_image i ON p.productId = i.productId WHERE p.name LIKE ? OR p.description LIKE ?', [`%${query}%`, `%${query}%`]);
        return rows.map((r) => ({
            id: r.productId,
            productId: r.productId,
            name: r.name,
            description: r.description,
            price: Number(r.price),
            sku: r.sku,
            quantity: Number(r.quantity),
            categoryId: r.categoryId || null,
            image: r.imageUrl || null,
        }));
    }
    async filterProducts(categoryId, minPrice, maxPrice, minRating, maxRating) {
        let sql = `SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity, i.imageUrl FROM product p LEFT JOIN product_image i ON p.productId = i.productId WHERE 1=1`;
        const params = [];
        if (categoryId) {
            sql += ' AND p.categoryId = ?';
            params.push(categoryId);
        }
        if (minPrice !== undefined) {
            sql += ' AND p.price >= ?';
            params.push(minPrice);
        }
        if (maxPrice !== undefined) {
            sql += ' AND p.price <= ?';
            params.push(maxPrice);
        }
        if (minRating !== undefined) {
            sql += ' AND p.rating >= ?';
            params.push(minRating);
        }
        if (maxRating !== undefined) {
            sql += ' AND p.rating <= ?';
            params.push(maxRating);
        }
        const rows = await this.defaultDb.query(sql, params);
        return rows.map((r) => ({
            id: r.productId,
            productId: r.productId,
            name: r.name,
            description: r.description,
            price: Number(r.price),
            sku: r.sku,
            quantity: Number(r.quantity),
            categoryId: r.categoryId || null,
            image: r.imageUrl || null,
        }));
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('DEFAULT_DB')),
    __param(1, (0, common_1.Inject)('BACKUP_DB')),
    __metadata("design:paramtypes", [Object, Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map