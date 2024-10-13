export interface UserResponse {
  status: number;
  data: string;
  dataUser: {
    id: string;
    email: string;
    name: string;
  };
}
