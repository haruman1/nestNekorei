import { Product } from './product.entity';
export declare class Category {
    id: number;
    categoryId: string;
    name: string;
    image: string;
    products: Product[];
}
export declare class CategoryHistory {
    id: number;
    categoryId: string;
    pesan: string;
    userId: string;
    createdAt: Date;
}
