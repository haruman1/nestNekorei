export declare class Cart {
    id: number;
    userId: string;
    items: CartItem[];
}
export declare class CartItem {
    id: number;
    cartId: number;
    productId: string;
    quantity: number;
}
