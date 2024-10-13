export interface OrderResponse {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  items: [
    {
      id: number;
      productId: string;
      name: string;
      quantity: number;
      price: number;
    },
  ];
}
