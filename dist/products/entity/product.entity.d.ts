import { Category } from './category.entity';
import { OrderItem } from 'src/orders/order.entity';
export declare class Product {
    id: number;
    productId: string;
    name: string;
    description: string;
    price: number;
    sku: string;
    quantity: number;
    category: Category;
    orderItems: OrderItem[];
}
export declare class ProductImage {
    id: number;
    productId: string;
    imageUrl: string;
    ImageId: string;
}
export declare class ProductHistory {
    id: number;
    productId: string;
    pesan: string;
    userId: string;
    createdAt: Date;
}
