declare class OrderItemDto {
    productId: number;
    quantity: number;
}
export declare class CreateOrderDto {
    userId: string;
    orderId: string;
    items: OrderItemDto[];
}
export {};
