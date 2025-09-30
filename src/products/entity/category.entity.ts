// import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Product } from './product.entity';

// @Entity()
// export class Category {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   categoryId: string;

//   @Column()
//   name: string;

//   @Column()
//   image: string;

//   @OneToMany(() => Product, (product) => product.category)
//   products: Product[];
// }
// @Entity()
// export class CategoryHistory {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column()
//   categoryId: string;

//   @Column()
//   pesan: string;

//   @Column()
//   userId: string;

//   @Column()
//   createdAt: Date;
// }
export interface CategoriesData {
  id: string;
  name: string;
  image: string;
}

export interface CategoriesResponse {
  status: number;
  data: CategoriesData[];
}
