import { ServerlessMysql } from 'serverless-mysql';
import { ProductsDto } from './dto';
import { Product, ProductResponse, CategoriesData, CategoriesResponse } from './entity';
import { EditEntity } from 'src/Entity/edit.entity';
export declare class ProductsService {
    private readonly defaultDb;
    private readonly backupDb;
    constructor(defaultDb: ServerlessMysql, backupDb: ServerlessMysql);
    private generateRandomCode;
    createProduct(createProductDto: ProductsDto.CreateProductDto, CategoryId: string, userId: string): Promise<Product>;
    findAllProducts(): Promise<ProductResponse>;
    findProductByProductId(id: string): Promise<Product>;
    updateProduct(id: string, updateProductDto: ProductsDto.UpdateProductDto, userId: string): Promise<EditEntity>;
    removeProduct(id: string): Promise<EditEntity>;
    createCategory(createCategoryDto: ProductsDto.CreateCategoryDto, userid: string): Promise<CategoriesResponse>;
    findAllCategoriesNew(): Promise<CategoriesResponse>;
    findCategoryById(id: string): Promise<CategoriesData>;
    updateCategory(id: string, updateCategoryDto: ProductsDto.UpdateCategoryDto, userid: string): Promise<EditEntity>;
    removeCategory(id: string, userId: string): Promise<EditEntity>;
    searchProducts(query: string): Promise<Product[]>;
    filterProducts(categoryId?: string, minPrice?: number, maxPrice?: number, minRating?: number, maxRating?: number): Promise<Product[]>;
}
