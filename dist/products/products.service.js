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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const category_entity_1 = require("./category.entity");
const CryptoJS = require("crypto-js");
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
    }
    generateRandomCode(name) {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        const randomCode = name + `-${randomNumber}`;
        return randomCode;
    }
    async createProduct(createProductDto, CategoryId) {
        const { categoryId, ...rest } = createProductDto;
        const category = await this.categoriesRepository.findOne({
            where: { id: CategoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const missingFields = [];
        if (!CategoryId) {
            missingFields.push('categoryId');
        }
        if (!rest.name) {
            missingFields.push('name');
        }
        if (!rest.description) {
            missingFields.push('description');
        }
        if (!rest.price) {
            missingFields.push('price');
        }
        if (!rest.sku) {
            missingFields.push('sku');
        }
        if (!rest.quantity) {
            missingFields.push('quantity');
        }
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`The following fields are missing: ${missingFields.join(', ')}.`);
        }
        const product = this.productsRepository.create({ ...rest, category });
        return this.productsRepository.save(product);
    }
    async findAllProducts() {
        return this.productsRepository.find({ relations: ['category'] });
    }
    async findProductById(id) {
        const product = await this.productsRepository.findOne({
            where: { category: { categoryId: id } },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found 1');
        }
        return product;
    }
    async findProductByProductId(id) {
        const product = await this.productsRepository.findOne({
            where: { productId: id },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found 2');
        }
        return product;
    }
    async updateProduct(id, updateProductDto) {
        const product = await this.findProductById(id);
        const { categoryId, ...rest } = updateProductDto;
        if (categoryId) {
            const category = await this.categoriesRepository.findOne({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException('Category not found');
            }
            product.category = category;
        }
        Object.assign(product, rest);
        return this.productsRepository.save(product);
    }
    async removeProduct(id) {
        const product = await this.findProductById(id);
        await this.productsRepository.remove(product);
    }
    async createCategory(createCategoryDto) {
        createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
        if (!createCategoryDto.name || !createCategoryDto.categoryId) {
            throw new common_1.BadRequestException('Name and categoryId is required');
        }
        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async findAllCategories() {
        return this.categoriesRepository.find({ relations: ['products'] });
    }
    async findCategoryById(id) {
        const category = await this.categoriesRepository.findOne({
            where: { categoryId: id },
            relations: ['products'],
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return category;
    }
    async updateCategory(id, updateCategoryDto) {
        const category = await this.findCategoryById(id);
        Object.assign(category, updateCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async removeCategory(id) {
        const category = await this.findCategoryById(id);
        await this.categoriesRepository.remove(category);
    }
    async searchProducts(query) {
        return this.productsRepository
            .createQueryBuilder('product')
            .where('product.name LIKE :query', { query: `%${query}%` })
            .orWhere('product.description LIKE :query', { query: `%${query}%` })
            .getMany();
    }
    async filterProducts(categoryId, minPrice, maxPrice, minRating) {
        let queryBuilder = this.productsRepository.createQueryBuilder('product');
        if (categoryId) {
            queryBuilder = queryBuilder.andWhere('product.category.id = :categoryId', { categoryId });
        }
        if (minPrice) {
            queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', {
                minPrice,
            });
        }
        if (maxPrice) {
            queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', {
                maxPrice,
            });
        }
        if (minRating) {
            queryBuilder = queryBuilder.andWhere('product.rating >= :minRating', {
                minRating,
            });
        }
        return queryBuilder.getMany();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map