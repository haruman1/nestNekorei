import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(body: {
        categoryId: number;
    }, createProductDto: CreateProductDto): Promise<import("./product.entity").Product>;
    findAllProducts(): Promise<import("./product.entity").Product[]>;
    findProductById(id: string): Promise<import("./product.entity").Product>;
    updateProduct(id: string, updateProductDto: UpdateProductDto): Promise<import("./product.entity").Product>;
    removeProduct(id: string): Promise<void>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    removeCategory(id: string): Promise<void>;
    searchProducts(query: string): Promise<import("./product.entity").Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<import("./product.entity").Product[]>;
}
