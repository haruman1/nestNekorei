import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductImage } from './entity/product.entity';
import { Category } from './entity/category.entity';
import { ProductsDto } from './dto';
import { ProductResponse } from './interface';
import * as CryptoJS from 'crypto-js';
import { CategoriesResponse } from './interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
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
    CategoryId: string,
  ): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({
      where: { categoryId: CategoryId },
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
    if (!rest.image) {
      missingFields.push('image');
    }

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `The following fields are missing: ${missingFields.join(', ')}.`,
      );
    }

    const product = this.productsRepository.create({ ...rest, category });
    const createImage = this.productImagesRepository.create({
      productId: rest.productId, // Ensure this is provided and valid
      imageUrl: rest.image, // Correct property name for the URLrelationship correctly
    });

    const savedProductImage = this.productImagesRepository.save(createImage);
    if (!savedProductImage) {
      throw new NotFoundException('Product image not found');
    }

    const savedProduct = await this.productsRepository.save(product);
    if (!savedProduct) {
      throw new NotFoundException('Product not found');
    }
    return savedProduct;
  }

  async findAllProducts(): Promise<ProductResponse> {
    // Fetch products with their related category and productImages in one query
    const products = await this.productsRepository.find({
      relations: ['category', 'productImages'],
    });

    const response: ProductResponse = {
      status: 200,
      data: products.map((product) => ({
        id: product.productId,
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku,
        quantity: product.quantity,
        categoryId: product.category?.categoryId || null, // Safely access categoryId
        // Check if the product has images, and get the first one if available
        image:
          product.productImages.length > 0
            ? product.productImages[0].imageUrl
            : null,
      })),
    };

    return response;
  }

  // async findProductById(id: string): Promise<Product> {
  //   const product = await this.productsRepository.findOne({
  //     where: { category: { categoryId: id } },
  //     relations: ['category'],
  //   });
  //   if (!product) {
  //     throw new NotFoundException('Product not found xxx');
  //   }
  //   return product;
  // }
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
  // async updateProduct(
  //   id: string,
  //   updateProductDto: ProductsDto.UpdateProductDto,
  // ): Promise<Product> {
  //   const product = await this.findProductById(id);
  //   const { categoryId, ...rest } = updateProductDto;
  //   if (categoryId) {
  //     const category = await this.categoriesRepository.findOne({
  //       where: { id: categoryId },
  //     });
  //     if (!category) {
  //       throw new NotFoundException('Category not found');
  //     }
  //     product.category = category;
  //   }
  //   Object.assign(product, rest);
  //   return this.productsRepository.save(product);
  // }

  // async removeProduct(id: string): Promise<void> {
  //   const product = await this.findProductById(id);
  //   await this.productsRepository.remove(product);
  // }

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

  async findAllCategoriesNew(): Promise<CategoriesResponse> {
    const categories = await this.categoriesRepository.find();

    const response: CategoriesResponse = {
      status: 200,
      data: categories.map((category) => ({
        id: category.categoryId,
        name: category.name,
      })),
    };
    return response;
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
