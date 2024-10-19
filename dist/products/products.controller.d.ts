import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entity/category.entity';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(body: {
        categoryId: string;
    }, createProductDto: CreateProductDto): Promise<import("./entity").Product>;
    findAllProducts(): Promise<import("./interface").ProductResponse>;
    createCategory(createCategoryDto: CreateCategoryDto): Promise<Category>;
    findCategoriesAll(): Promise<import("./interface").CategoriesResponse>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
    removeCategory(id: string): Promise<void>;
    searchProducts(query: string): Promise<import("./entity").Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<import("./entity").Product[]>;
}
