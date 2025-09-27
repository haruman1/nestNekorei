declare class OrderItemDto {
    productId: String;
    quantity: number;
}
export declare class CreateOrderDto {
    userId: string;
    items: OrderItemDto[];
}
export {};
