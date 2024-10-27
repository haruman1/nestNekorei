export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sku: string;
  quantity: number;
  categoryId: string | null; // Category might be null
  image: string | null; // Image might be null if not available
}

export interface ProductResponse {
  status: number;
  data: Product[];
}
export interface ResponseBiasa {
  status: number;
  message: string;
}
