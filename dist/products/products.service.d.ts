import { Repository } from 'typeorm';
import { Product, ProductImage } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { ProductsDto } from './dto';
import { ProductResponse } from './interface';
import { CategoriesResponse } from './interface';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    private productImagesRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>, productImagesRepository: Repository<ProductImage>);
    generateRandomCode(name: string): string;
    createProduct(createProductDto: ProductsDto.CreateProductDto, CategoryId: string): Promise<Product>;
    findAllProducts(): Promise<ProductResponse>;
    findProductByProductId(id: string): Promise<Product>;
    createCategory(createCategoryDto: ProductsDto.CreateCategoryDto): Promise<Category>;
    findAllCategoriesNew(): Promise<CategoriesResponse>;
    findCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, updateCategoryDto: ProductsDto.UpdateCategoryDto): Promise<Category>;
    removeCategory(id: string): Promise<void>;
    searchProducts(query: string): Promise<Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<Product[]>;
}
