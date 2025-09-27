export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    sku: string;
    quantity: number;
    categoryId: string | null;
    image: string | null;
}
export interface ProductResponse {
    status: number;
    data: Product[];
}
