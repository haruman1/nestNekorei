import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductsDto } from './dto';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>);
    generateRandomCode(name: string): string;
    createProduct(createProductDto: ProductsDto.CreateProductDto, CategoryId: number): Promise<Product>;
    findAllProducts(): Promise<Product[]>;
    findProductById(id: string): Promise<Product>;
    findProductByProductId(id: string): Promise<Product>;
    updateProduct(id: string, updateProductDto: ProductsDto.UpdateProductDto): Promise<Product>;
    removeProduct(id: string): Promise<void>;
    createCategory(createCategoryDto: ProductsDto.CreateCategoryDto): Promise<Category>;
    findAllCategories(): Promise<Category[]>;
    findCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, updateCategoryDto: ProductsDto.UpdateCategoryDto): Promise<Category>;
    removeCategory(id: string): Promise<void>;
    searchProducts(query: string): Promise<Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<Product[]>;
}
