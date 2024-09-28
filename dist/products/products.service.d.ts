import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductsDto } from './dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    createProduct(createProductDto: ProductsDto.CreateProductDto, CategoryId: number): Promise<Product>;
    findAllProducts(): Promise<Product[]>;
    findProductById(id: number): Promise<Product>;
    updateProduct(id: number, updateProductDto: ProductsDto.UpdateProductDto): Promise<Product>;
    removeProduct(id: number): Promise<void>;
    createCategory(createCategoryDto: ProductsDto.CreateCategoryDto): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    findCategoryById(id: number): Promise<Category>;
    updateCategory(id: number, updateCategoryDto: ProductsDto.UpdateCategoryDto): Promise<Category>;
    removeCategory(id: number): Promise<void>;
    searchProducts(query: string): Promise<Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<Product[]>;
}
