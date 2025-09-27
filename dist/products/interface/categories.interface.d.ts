export interface CategoriesData {
    id: string;
    name: string;
    image: string;
}
export interface CategoriesResponse {
    status: number;
    data: CategoriesData[];
}
