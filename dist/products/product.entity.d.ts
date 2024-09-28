import { Category } from './category.entity';
export declare class Product {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    quantity: number;
    category: Category;
}
