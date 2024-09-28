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
const common_1 = require("@nestjs/common");
const products_service_1 = require("./products.service");
const create_product_dto_1 = require("./dto/create-product.dto");
const update_product_dto_1 = require("./dto/update-product.dto");
const create_category_dto_1 = require("./dto/create-category.dto");
const update_category_dto_1 = require("./dto/update-category.dto");
const jwt_auth_guard_1 = require("../auth/jwt/jwt-auth.guard");
let ProductsController = class ProductsController {
    constructor(productsService) {
        this.productsService = productsService;
    }
    createProduct(body, createProductDto) {
        return this.productsService.createProduct(createProductDto, body.categoryId);
    }
    findAllProducts() {
        return this.productsService.findAllProducts();
    }
    findProductById(id) {
        return this.productsService.findProductById(id);
    }
    updateProduct(id, updateProductDto) {
        return this.productsService.updateProduct(id, updateProductDto);
    }
    removeProduct(id) {
        return this.productsService.removeProduct(id);
    }
    createCategory(createCategoryDto) {
        if (!createCategoryDto.name) {
            throw new common_1.BadRequestException('Please provide a Valid Input');
        }
        return this.productsService.createCategory(createCategoryDto);
    }
    findAllCategories() {
        return this.productsService.findAllCategories();
    }
    findCategoryById(id) {
        return this.productsService.findCategoryById(id);
    }
    updateCategory(id, updateCategoryDto) {
        return this.productsService.updateCategory(id, updateCategoryDto);
    }
    removeCategory(id) {
        return this.productsService.removeCategory(id);
    }
    searchProducts(query) {
        return this.productsService.searchProducts(query);
    }
    filterProducts(categoryId, minPrice, maxPrice, minRating) {
        return this.productsService.filterProducts(categoryId, minPrice, maxPrice, minRating);
    }
};
exports.ProductsController = ProductsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_product_dto_1.CreateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllProducts", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findProductById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_product_dto_1.UpdateProductDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeProduct", null);
__decorate([
    (0, common_1.Post)('categories'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)('categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Get)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "findCategoryById", null);
__decorate([
    (0, common_1.Patch)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_category_dto_1.UpdateCategoryDto]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('categories/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "removeCategory", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('query')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "searchProducts", null);
__decorate([
    (0, common_1.Get)('filter'),
    __param(0, (0, common_1.Query)('categoryId')),
    __param(1, (0, common_1.Query)('minPrice')),
    __param(2, (0, common_1.Query)('maxPrice')),
    __param(3, (0, common_1.Query)('minRating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], ProductsController.prototype, "filterProducts", null);
exports.ProductsController = ProductsController = __decorate([
    (0, common_1.Controller)('products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [products_service_1.ProductsService])
], ProductsController);
//# sourceMappingURL=products.controller.js.map