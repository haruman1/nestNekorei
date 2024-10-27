import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Req,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product, ProductHistory, ProductImage } from './entity/product.entity';
import { Category, CategoryHistory } from './entity/category.entity';
import { ProductsDto } from './dto';
import { ProductResponse } from './interface';
import * as CryptoJS from 'crypto-js';
import { CategoriesResponse } from './interface';
import { CategoriesData } from './interface/categories.interface';
import { ResponseBiasa } from './interface/Product.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product, 'default')
    private productsRepository: Repository<Product>,
    @InjectRepository(Category, 'default')
    private categoriesRepository: Repository<Category>,
    @InjectRepository(CategoryHistory, 'backup')
    private categoriesHistoryRepository: Repository<CategoryHistory>,
    @InjectRepository(ProductImage, 'default')
    private productImagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductHistory, 'backup')
    private productHistoryRepository: Repository<ProductHistory>,
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
    userId: string,
  ): Promise<Product> {
    const { categoryId, ...rest } = createProductDto;
    const category = await this.categoriesRepository.findOne({
      where: { categoryId: CategoryId },
    });
    if (!category) {
      throw new BadRequestException('Kategori belum di pilih');
    }
    const missingFields: string[] = [];
    if (!CategoryId) {
      missingFields.push('Kategori ');
    }
    if (!rest.name) {
      missingFields.push('Nama Produk');
    }

    if (!rest.description) {
      missingFields.push('Deskripsi produk');
    }

    if (!rest.price) {
      missingFields.push('Harga produk');
    }

    if (!rest.sku) {
      missingFields.push('SKU Produk');
    }
    if (!rest.quantity) {
      missingFields.push('Kuantitas Produk');
    }
    if (!rest.image) {
      missingFields.push('Foto Produk');
    }

    if (missingFields.length > 0) {
      throw new BadRequestException(
        `Data tidak lengkap: ${missingFields.join(', ')}.`,
      );
    }

    const product = this.productsRepository.create({ ...rest, category });
    const createImage = this.productImagesRepository.create({
      productId: product.productId, // Ensure this is provided and valid
      imageUrl: rest.image,
    });
    const ProductCreated = this.productHistoryRepository.save(
      this.productHistoryRepository.create({
        productId: rest.productId,
        pesan: 'Product Berhasil dibuat oleh ' + userId + ' pada ' + new Date(),
        userId: userId,
        createdAt: new Date(),
      }),
    );

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
    // Fetch products with their related category in one query
    const products = await this.productsRepository.find({
      relations: ['category'],
    });

    // Fetch all product images related to the product IDs from the products list
    const productIds = products.map((product) => product.productId);
    const productImages = await this.productImagesRepository.find({
      where: { productId: In(productIds) }, // Using In to get all images related to these product IDs
    });

    // Create a map to link productId with their corresponding images
    const imageMap = new Map<string, string>();
    productImages.forEach((image) => {
      imageMap.set(image.productId, image.imageUrl); // Add productId and imageUrl to the map
    });

    // Prepare the response
    const response: ProductResponse = {
      status: 200,
      data: products.map((product) => {
        const { productId, name, description, price, sku, quantity, category } =
          product;

        return {
          id: productId,
          name,
          description,
          price,
          sku,
          quantity,
          categoryId: category?.categoryId || null, // Safely access categoryId
          image: imageMap.get(productId) || null, // Get image from the map or return null if not found
        };
      }),
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
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async updateProduct(
    id: string,
    updateProductDto: ProductsDto.UpdateProductDto,
  ): Promise<ResponseBiasa> {
    const product = await this.findProductByProductId(id);
    const Image = await this.productImagesRepository.findOne({
      where: { productId: id },
    });
    const { categoryId, ...rest } = updateProductDto;
    if (categoryId) {
      const category = await this.categoriesRepository.findOne({
        where: { id: categoryId },
      });
      if (!category) {
        throw new BadRequestException('Category not found');
      }
      product.category = category;
    }
    Object.assign(product, rest);

    this.productsRepository.save(product);
    return {
      status: 200,
      message: 'Product updated successfully',
    };
  }

  // async removeProduct(id: string): Promise<void> {
  //   const product = await this.findProductById(id);
  //   await this.productsRepository.remove(product);
  // }

  async createCategory(
    createCategoryDto: ProductsDto.CreateCategoryDto,
    userid: string,
  ): Promise<CategoriesResponse> {
    createCategoryDto.categoryId = this.generateRandomCode('CTNEK');
    if (
      !createCategoryDto.name ||
      !createCategoryDto.categoryId ||
      !createCategoryDto.image
    ) {
      throw new BadRequestException(
        'Name and categoryId and image is required',
      );
    }

    const existingCategory = await this.categoriesRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    const history = this.categoriesHistoryRepository.save(
      this.categoriesHistoryRepository.create({
        categoryId: createCategoryDto.categoryId,
        pesan:
          'Category Berhasil dibuat oleh ' + userid + ' pada ' + new Date(),
        userId: userid,
        createdAt: new Date(),
      }),
    );
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = this.categoriesRepository.create(createCategoryDto);
    const savedCategory = await this.categoriesRepository.save(category);
    return {
      status: 201,
      data: [
        {
          id: savedCategory.categoryId,
          name: savedCategory.name,
          image: savedCategory.image,
        },
      ],
    };
  }

  async findAllCategoriesNew(): Promise<CategoriesResponse> {
    const categories = await this.categoriesRepository.find();

    const response: CategoriesResponse = {
      status: 200,
      data: categories.map((category) => ({
        id: category.categoryId,
        name: category.name,
        image: category.image,
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
      throw new NotFoundException('Category not found 1');
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
