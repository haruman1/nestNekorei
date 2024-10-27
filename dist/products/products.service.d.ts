import { Repository } from 'typeorm';
import { Product, ProductHistory, ProductImage } from './entity/product.entity';
import { Category, CategoryHistory } from './entity/category.entity';
import { ProductsDto } from './dto';
import { ProductResponse } from './interface';
import { CategoriesResponse } from './interface';
import { ResponseBiasa } from './interface/Product.interface';
export declare class ProductsService {
    private productsRepository;
    private categoriesRepository;
    private categoriesHistoryRepository;
    private productImagesRepository;
    private productHistoryRepository;
    constructor(productsRepository: Repository<Product>, categoriesRepository: Repository<Category>, categoriesHistoryRepository: Repository<CategoryHistory>, productImagesRepository: Repository<ProductImage>, productHistoryRepository: Repository<ProductHistory>);
    generateRandomCode(name: string): string;
    createProduct(createProductDto: ProductsDto.CreateProductDto, CategoryId: string, userId: string): Promise<Product>;
    findAllProducts(): Promise<ProductResponse>;
    findProductByProductId(id: string): Promise<Product>;
    updateProduct(id: string, updateProductDto: ProductsDto.UpdateProductDto): Promise<ResponseBiasa>;
    createCategory(createCategoryDto: ProductsDto.CreateCategoryDto, userid: string): Promise<CategoriesResponse>;
    findAllCategoriesNew(): Promise<CategoriesResponse>;
    findCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, updateCategoryDto: ProductsDto.UpdateCategoryDto): Promise<Category>;
    removeCategory(id: string): Promise<void>;
    searchProducts(query: string): Promise<Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<Product[]>;
}
