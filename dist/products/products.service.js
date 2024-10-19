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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const product_entity_1 = require("./entity/product.entity");
const category_entity_1 = require("./entity/category.entity");
const CryptoJS = __importStar(require("crypto-js"));
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository, productImagesRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.productImagesRepository = productImagesRepository;
    }
    generateRandomCode(name) {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        const randomCode = name + `-${randomNumber}`;
        return randomCode;
    }
    async createProduct(createProductDto, CategoryId) {
        const { categoryId, ...rest } = createProductDto;
        const category = await this.categoriesRepository.findOne({
            where: { categoryId: CategoryId },
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
        if (!rest.image) {
            missingFields.push('image');
        }
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`The following fields are missing: ${missingFields.join(', ')}.`);
        }
        const product = this.productsRepository.create({ ...rest, category });
        const createImage = this.productImagesRepository.create({
            productId: rest.productId,
            imageUrl: rest.image,
        });
        const savedProductImage = this.productImagesRepository.save(createImage);
        if (!savedProductImage) {
            throw new common_1.NotFoundException('Product image not found');
        }
        const savedProduct = await this.productsRepository.save(product);
        if (!savedProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        return savedProduct;
    }
    async findAllProducts() {
        const products = await this.productsRepository.find({
            relations: ['category', 'productImages'],
        });
        const response = {
            status: 200,
            data: products.map((product) => ({
                id: product.productId,
                name: product.name,
                description: product.description,
                price: product.price,
                sku: product.sku,
                quantity: product.quantity,
                categoryId: product.category?.categoryId || null,
                image: product.productImages.length > 0
                    ? product.productImages[0].imageUrl
                    : null,
            })),
        };
        return response;
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
    async createCategory(createCategoryDto) {
        createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
        if (!createCategoryDto.name || !createCategoryDto.categoryId) {
            throw new common_1.BadRequestException('Name and categoryId is required');
        }
        const category = this.categoriesRepository.create(createCategoryDto);
        return this.categoriesRepository.save(category);
    }
    async findAllCategoriesNew() {
        const categories = await this.categoriesRepository.find();
        const response = {
            status: 200,
            data: categories.map((category) => ({
                id: category.categoryId,
                name: category.name,
            })),
        };
        return response;
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
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.ProductImage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map