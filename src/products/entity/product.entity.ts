import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { OrderItem } from 'src/orders/order.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  sku: string;

  @Column('int')
  quantity: number;

  // Many-to-One relation with Category
  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  // One-to-Many relation with OrderItem
  @OneToMany(() => OrderItem, (orderItem) => orderItem.product)
  orderItems: OrderItem[];

  // One-to-Many relation with ProductImage
  @OneToMany(() => ProductImage, (productImage) => productImage.product)
  productImages: ProductImage[];
}

// ProductImage entity definition

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: string; // This should match the product's productId

  @Column()
  imageUrl: string; // Correct column name for storing the image URL

  @ManyToOne(() => Product, (product) => product.productImages)
  product: Product; // Correctly reference the Product entity
}
