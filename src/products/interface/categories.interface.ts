export interface Categories {
  id: string;
  name: string;
}

export interface CategoriesResponse {
  status: number;
  data: Categories[];
}
