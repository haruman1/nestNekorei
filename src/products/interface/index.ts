import { CategoriesResponse } from './categories.interface';
import { ProductResponse } from './Product.interface';

export { CategoriesResponse, ProductResponse };

export interface ResponseBiasa {
  status: number;
  message?: string;
}
