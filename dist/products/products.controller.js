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
exports.ProductsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_auth_guard_1 = require("../auth/jwt/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    createProduct(req, createProductDto) {
        return this.productsService.createProduct(createProductDto, String(createProductDto.categoryId), req.user.userId);
    }
    findAllProducts() {
        return this.productsService.findAllProducts();
    }
    searchProducts(query) {
        return this.productsService.searchProducts(query);
    }
    filterProducts(categoryId, minPrice, maxPrice, minRating) {
        return this.productsService.filterProducts(categoryId, minPrice, maxPrice, minRating);
    }
    updateProduct(id, updateProductDto, req) {
        return this.productsService.updateProduct(id, updateProductDto, req.user.userId);
    }
    removeProduct(id) {
        return this.productsService.removeProduct(id);
    }
    createCategory(createCategoryDto, req) {
        if (!createCategoryDto.name) {
            throw new common_1.BadRequestException('Please provide a Valid Input');
        }
        return this.productsService.createCategory(createCategoryDto, req.user.userId);
    }
    findCategoriesAll() {
        return this.productsService.findAllCategoriesNew();
    }
    updateCategory(id, updateCategoryDto, req) {
        return this.productsService.updateCategory(id, updateCategoryDto, req.user.userId);
    }
    removeCategory(id, req) {
        return this.productsService.removeCategory(id, req.user.userId);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat produk baru' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Produk berhasil dibuat.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Input tidak valid.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 201, type: require("./entity/product.entity").Product }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan semua daftar produk' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Berhasil mengambil data produk.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Get)('search'),
    (0, swagger_1.ApiOperation)({ summary: 'Mencari produk berdasarkan kata kunci' }),
    (0, swagger_1.ApiQuery)({
        name: 'query',
        required: true,
        type: String,
        description: 'Kata kunci untuk pencarian produk',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hasil pencarian produk.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: [require("./entity/product.entity").Product] }),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Get)('filter'),
    (0, swagger_1.ApiOperation)({ summary: 'Filter produk berdasarkan kriteria' }),
    (0, swagger_1.ApiQuery)({
        name: 'categoryId',
        required: false,
        type: Number,
        description: 'Filter berdasarkan ID kategori',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minPrice',
        required: false,
        type: Number,
        description: 'Harga minimum',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxPrice',
        required: false,
        type: Number,
        description: 'Harga maksimum',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minRating',
        required: false,
        type: Number,
        description: 'Rating minimum (1-5)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Hasil filter produk.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: [require("./entity/product.entity").Product] }),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('minRating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "filterProducts", null);
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui data produk berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID unik produk', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Produk berhasil diperbarui.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produk tidak ditemukan.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_product_dto_1.UpdateProductDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, swagger_1.ApiTags)('Products'),
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus produk berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID unik produk', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Produk berhasil dihapus.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Produk tidak ditemukan.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeProduct", null);
__decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Post)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Membuat kategori produk baru' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Kategori berhasil dibuat.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Input tidak valid.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 201, type: Object }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Get)('categories'),
    (0, swagger_1.ApiOperation)({ summary: 'Mendapatkan semua daftar kategori' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Berhasil mengambil data kategori.',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findCategoriesAll", null);
__decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Patch)('categories/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Memperbarui kategori berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID unik kategori', type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Kategori berhasil diperbarui.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kategori tidak ditemukan.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_category_dto_1.UpdateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Delete)('categories/:id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Menghapus kategori berdasarkan ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID unik kategori', type: String }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Kategori berhasil dihapus.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Kategori tidak ditemukan.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Tidak terautentikasi.' }),
    openapi.ApiResponse({ status: common_1.HttpStatus.NO_CONTENT, type: Object }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeCategory", null);
exports.ProductsController = ProductsController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map