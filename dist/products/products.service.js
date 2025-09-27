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
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entity/product.entity");
const category_entity_1 = require("./entity/category.entity");
const CryptoJS = __importStar(require("crypto-js"));
let ProductsService = class ProductsService {
    constructor(productsRepository, categoriesRepository, categoriesHistoryRepository, productImagesRepository, productHistoryRepository) {
        this.productsRepository = productsRepository;
        this.categoriesRepository = categoriesRepository;
        this.categoriesHistoryRepository = categoriesHistoryRepository;
        this.productImagesRepository = productImagesRepository;
        this.productHistoryRepository = productHistoryRepository;
    }
    generateRandomCode(name) {
        const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
        const randomCode = name + `-${randomNumber}`;
        return randomCode;
    }
    async createProduct(createProductDto, CategoryId, userId) {
        const { categoryId, ...rest } = createProductDto;
        const category = await this.categoriesRepository.findOne({
            where: { categoryId: CategoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Kategori belum di pilih');
        }
        const missingFields = [];
        if (!CategoryId) {
            missingFields.push('Kategori ');
        }
        if (!rest.name) {
            missingFields.push('Nama Produk');
        }
        if (!rest.description) {
            missingFields.push('Deskripsi produk');
        }
        if (!rest.price) {
            missingFields.push('Harga produk');
        }
        if (!rest.sku) {
            missingFields.push('SKU Produk');
        }
        if (!rest.quantity) {
            missingFields.push('Kuantitas Produk');
        }
        if (!rest.image) {
            missingFields.push('Foto Produk');
        }
        if (missingFields.length > 0) {
            throw new common_1.BadRequestException(`Data tidak lengkap: ${missingFields.join(', ')}.`);
        }
        const product = this.productsRepository.create({ ...rest, category });
        const createImage = this.productImagesRepository.create({
            productId: product.productId,
            imageUrl: rest.image,
            ImageId: rest.imageId,
        });
        const ProductCreated = this.productHistoryRepository.save(this.productHistoryRepository.create({
            productId: rest.productId,
            pesan: 'Product Berhasil dibuat oleh ' +
                userId +
                ' pada ' +
                new Date() +
                ' dengan image id : ' +
                rest.imageId,
            userId: userId,
            createdAt: new Date(),
        }));
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
            relations: ['category'],
        });
        const productIds = products.map((product) => product.productId);
        const productImages = await this.productImagesRepository.find({
            where: { productId: (0, typeorm_2.In)(productIds) },
        });
        const imageMap = new Map();
        productImages.forEach((image) => {
            imageMap.set(image.productId, image.imageUrl);
        });
        const response = {
            status: 200,
            data: products.map((product) => {
                const { productId, name, description, price, sku, quantity, category } = product;
                return {
                    id: productId,
                    name,
                    description,
                    price,
                    sku,
                    quantity,
                    categoryId: category?.categoryId || null,
                    image: imageMap.get(productId) || null,
                };
            }),
        };
        return response;
    }
    async findProductByProductId(id) {
        const product = await this.productsRepository.findOne({
            where: { productId: id },
            relations: ['category'],
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async updateProduct(id, updateProductDto, userId) {
        const Product = await this.findProductByProductId(id);
        if (!Product) {
            return {
                status: 400,
                message: 'Produk Tidak ada, Silahkan Edit Produk yang ada',
            };
        }
        const ImageProduct = await this.productImagesRepository.findOne({
            where: { productId: id },
        });
        if (!ImageProduct) {
            return {
                status: 400,
                message: 'Produk belum mempunyai gambar, Silahkan hubungin Haruman!',
            };
        }
        const CategoryProduct = await this.categoriesRepository.findOne({
            where: { categoryId: Product.category.categoryId },
        });
        if (!CategoryProduct) {
            return {
                status: 400,
                message: 'Kategori tidak ada, silahkan Edit dengan menggunakan kategori yang ada',
            };
        }
        const resultGambar = await this.productImagesRepository.update({ id: ImageProduct.id }, { imageUrl: updateProductDto.image });
        if (resultGambar.affected === 0) {
            throw new common_1.BadRequestException('Gambar gagal di update, Silahkan coba lagi!');
        }
        const UpdatedProduct = this.productsRepository.merge(Product, updateProductDto);
        await this.productsRepository.save(UpdatedProduct);
        await this.productHistoryRepository.save(this.productHistoryRepository.create({
            productId: Product.productId,
            pesan: `Product Berhasil diperbarui oleh ${userId} pada ${new Date()}`,
            userId: userId,
            createdAt: new Date(),
        }));
        return {
            status: 200,
            message: `Produk dengan ID ${id} berhasil diperbarui`,
        };
    }
    async removeProduct(id) {
        const product = await this.findProductByProductId(id);
        await this.productsRepository.remove(product);
        return {
            status: 200,
            message: `Produk dengan ID ${id} berhasil dihapus`,
        };
    }
    async createCategory(createCategoryDto, userid) {
        createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
        if (!createCategoryDto.name ||
            !createCategoryDto.categoryId ||
            !createCategoryDto.image) {
            throw new common_1.BadRequestException('Name and categoryId and image is required');
        }
        const existingCategory = await this.categoriesRepository.findOne({
            where: { name: createCategoryDto.name },
        });
        const history = this.categoriesHistoryRepository.save(this.categoriesHistoryRepository.create({
            categoryId: createCategoryDto.categoryId,
            pesan: 'Category Berhasil dibuat oleh ' + userid + ' pada ' + new Date(),
            userId: userid,
            createdAt: new Date(),
        }));
        if (existingCategory) {
            throw new common_1.ConflictException('Category already exists');
        }
        const category = this.categoriesRepository.create(createCategoryDto);
        const savedCategory = await this.categoriesRepository.save(category);
        return {
            status: 201,
            data: [
                {
                    id: savedCategory.categoryId,
                    name: savedCategory.name,
                    image: savedCategory.image,
                },
            ],
        };
    }
    async findAllCategoriesNew() {
        const categories = await this.categoriesRepository.find();
        const response = {
            status: 200,
            data: categories.map((category) => ({
                id: category.categoryId,
                name: category.name,
                image: category.image,
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
            throw new common_1.NotFoundException('Category not found 1');
        }
        return category;
    }
    async updateCategory(id, updateCategoryDto, userid) {
        const category = await this.findCategoryById(id);
        const UpdateCategori = this.categoriesRepository.merge(category, updateCategoryDto);
        await this.categoriesRepository.save(UpdateCategori);
        const history = this.categoriesHistoryRepository.save(this.categoriesHistoryRepository.create({
            categoryId: id,
            pesan: 'Category Berhasil dibuat oleh ' + userid + ' pada ' + new Date(),
            userId: userid,
            createdAt: new Date(),
        }));
        return {
            status: 200,
            message: `Kategori dengan ID ${id} berhasil diperbarui`,
        };
    }
    async removeCategory(id, userId) {
        const category = await this.findCategoryById(id);
        await this.categoriesRepository.remove(category);
        const history = this.categoriesHistoryRepository.save(this.categoriesHistoryRepository.create({
            categoryId: category.categoryId,
            pesan: 'Category Berhasil dihapus oleh ' + userId + ' pada ' + new Date(),
            userId: userId,
            createdAt: new Date(),
        }));
        return {
            status: 200,
            message: `Kategori dengan ID ${id} berhasil dihapus`,
        };
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
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product, 'default')),
    __param(1, (0, typeorm_1.InjectRepository)(category_entity_1.Category, 'default')),
    __param(2, (0, typeorm_1.InjectRepository)(category_entity_1.CategoryHistory, 'backup')),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.ProductImage, 'default')),
    __param(4, (0, typeorm_1.InjectRepository)(product_entity_1.ProductHistory, 'backup')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductsService);
//# sourceMappingURL=products.service.js.map