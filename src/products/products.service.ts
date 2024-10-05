import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { ProductsDto } from './dto';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  generateRandomCode(name: string): string {
    const randomNumber = CryptoJS.lib.WordArray.random(4).toString(); // Menghasilkan angka acak (4 byte)
    const randomCode = name + `-${randomNumber}`; // Gabungkan "NK" dengan angka acak
    return randomCode;
  }
  /**
   * Creates a new product.
   *
   * @param createProductDto the data used to create the product
   * @returns the created product
   */
  async createProduct(
    createProductDto: ProductsDto.CreateProductDto,
    CategoryId: number,
  ): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({
      where: { id: CategoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const missingFields: string[] = [];
    if (!CategoryId) {
      missingFields.push('categoryId');
    }
    if (!rest.name) {
      missingFields.push('name');
    }

    if (!rest.description) {
      missingFields.push('description');
    }

    if (!rest.price) {
      missingFields.push('price');
    }

    if (!rest.sku) {
      missingFields.push('sku');
    }
    if (!rest.quantity) {
      missingFields.push('quantity');
    }

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `The following fields are missing: ${missingFields.join(', ')}.`,
      );
    }

    const product = this.productsRepository.create({ ...rest, category });
    return this.productsRepository.save(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productsRepository.find({ relations: ['category'] });
  }

  async findProductById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { category: { categoryId: id } },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found 1');
    }
    return product;
  }
  async findProductByProductId(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { productId: id },
      relations: ['category'],
    });
    if (!product) {
      throw new NotFoundException('Product not found 2');
    }
    return product;
  }
  async updateProduct(
    id: string,
    updateProductDto: ProductsDto.UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findProductById(id);
    const { categoryId, ...rest } = updateProductDto;
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async removeProduct(id: string): Promise<void> {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
  }

  async createCategory(
    createCategoryDto: ProductsDto.CreateCategoryDto,
  ): Promise<Category> {
    createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
    if (!createCategoryDto.name || !createCategoryDto.categoryId) {
      throw new BadRequestException('Name and categoryId is required');
    }

    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find({ relations: ['products'] });
  }

  async findCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { categoryId: id },
      relations: ['products'],
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async updateCategory(
    id: string,
    updateCategoryDto: ProductsDto.UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, updateCategoryDto);
    return this.categoriesRepository.save(category);
  }

  async removeCategory(id: string): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }
  async searchProducts(query: string): Promise<Product[]> {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('product.description LIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async filterProducts(
    categoryId?: number,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
  ): Promise<Product[]> {
    let queryBuilder = this.productsRepository.createQueryBuilder('product');

    if (categoryId) {
      queryBuilder = queryBuilder.andWhere(
        'product.category.id = :categoryId',
        { categoryId },
      );
    }

    if (minPrice) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice,
      });
    }

    if (maxPrice) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice,
      });
    }

    if (minRating) {
      queryBuilder = queryBuilder.andWhere('product.rating >= :minRating', {
        minRating,
      });
    }

    return queryBuilder.getMany();
  }
}
