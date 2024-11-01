import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(req: Request & {
        user: JwtPayload;
    }, body: {
        categoryId: string;
    }, createProductDto: CreateProductDto): Promise<import("./entity").Product>;
    findAllProducts(): Promise<import("./interface").ProductResponse>;
    updateProduct(id: string, updateProductDto: UpdateProductDto, req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface").ResponseBiasa>;
    removeProduct(id: string): Promise<import("./interface").ResponseBiasa>;
    createCategory(createCategoryDto: CreateCategoryDto, req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface").CategoriesResponse>;
    findCategoriesAll(): Promise<import("./interface").CategoriesResponse>;
    updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface").ResponseBiasa>;
    removeCategory(id: string, req: Request & {
        user: JwtPayload;
    }): Promise<import("./interface").ResponseBiasa>;
    searchProducts(query: string): Promise<import("./entity").Product[]>;
    filterProducts(categoryId?: number, minPrice?: number, maxPrice?: number, minRating?: number): Promise<import("./entity").Product[]>;
}
