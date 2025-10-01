import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Inject,
} from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import { ServerlessMysql } from 'serverless-mysql';
import { ProductsDto } from './dto';
import {
  Product,
  ProductResponse,
  CategoriesData,
  CategoriesResponse,
} from './entity';

import { EditEntity } from 'src/Entity/edit.entity';
@Injectable()
export class ProductsService {
  constructor(
    @Inject('DEFAULT_DB') private readonly defaultDb: ServerlessMysql,
    @Inject('BACKUP_DB') private readonly backupDb: ServerlessMysql,
  ) {}

  private generateRandomCode(prefix: string): string {
    const randomNumber = CryptoJS.lib.WordArray.random(4).toString();
    return `${prefix}-${randomNumber}`;
  }
  async generateUUID() {
    const { v4: uuidv4 } = await import('uuid');
    return uuidv4();
  }
  // -----------------------------
  // CREATE PRODUCT
  // -----------------------------
  async createProduct(
    createProductDto: ProductsDto.CreateProductDto,
    CategoryId: string,
    userId: string,
  ): Promise<Product> {
    const {
      productId,
      name,
      description,
      price,
      sku,
      quantity,
      image,
      imageId,
      // categoryId is provided via CategoryId param
    } = createProductDto;

    // 1) cek kategori
    const [category] = await this.defaultDb.query<any[]>(
      'SELECT * FROM category WHERE categoryId = ? LIMIT 1',
      [CategoryId],
    );
    if (!category) {
      throw new BadRequestException('Kategori belum dipilih / tidak ditemukan');
    }

    // 2) cek productId unik
    const [existing] = await this.defaultDb.query<any[]>(
      'SELECT productId FROM product WHERE productId = ? LIMIT 1',
      [productId],
    );
    if (existing) {
      throw new ConflictException('Product ID sudah ada');
    }

    // 3) insert product
    await this.defaultDb.query(
      `INSERT INTO product
       (productId, name, description, price, sku, quantity, categoryId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [productId, name, description, price, sku, quantity, CategoryId],
    );

    // 4) insert product image
    const imgId = imageId || this.generateUUID();
    await this.defaultDb.query(
      `INSERT INTO product_image (ImageId, productId, imageUrl, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [imgId, productId, image],
    );

    // 5) insert history di backup DB
    await this.backupDb.query(
      `INSERT INTO product_history (productId, pesan, userId, createdAt)
       VALUES (?, ?, ?, NOW())`,
      [
        productId,
        `Product dibuat oleh ${userId} pada ${new Date().toISOString()} dengan imageId ${imgId}`,
        userId,
      ],
    );

    // 6) return product object (sesuai interface Product)
    const product: Product = {
      id: productId,
      name,
      description,
      price,
      sku,
      quantity,
      categoryId: CategoryId,
      image,
    };

    return product;
  }

  // -----------------------------
  // FIND ALL PRODUCTS
  // -----------------------------
  async findAllProducts(): Promise<ProductResponse> {
    // ambil product + category + satu image (ambil pertama)
    const rows = await this.defaultDb.query<any[]>(
      `SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity,
              p.categoryId, i.imageUrl
       FROM product p
       LEFT JOIN (
         SELECT productId, imageUrl
         FROM product_image
         GROUP BY productId
       ) i ON i.productId = p.productId`,
    );

    const data: Product[] = rows.map((r) => ({
      id: r.productId,
      productId: r.productId,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      sku: r.sku,
      quantity: Number(r.quantity),
      categoryId: r.categoryId || null,
      image: r.imageUrl || null,
    }));

    return {
      status: 200,
      data,
    };
  }

  // -----------------------------
  // FIND PRODUCT BY ID
  // -----------------------------
  async findProductByProductId(id: string): Promise<Product> {
    const [row] = await this.defaultDb.query<any[]>(
      `SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity,
              p.categoryId, i.imageUrl
       FROM product p
       LEFT JOIN (
         SELECT productId, imageUrl
         FROM product_image
         WHERE productId = ?
         LIMIT 1
       ) i ON i.productId = p.productId
       WHERE p.productId = ?
       LIMIT 1`,
      [id, id],
    );

    if (!row) {
      throw new NotFoundException('Product not found');
    }

    const product: Product = {
      id: row.productId,
      name: row.name,
      description: row.description,
      price: Number(row.price),
      sku: row.sku,
      quantity: Number(row.quantity),
      categoryId: row.categoryId || null,
      image: row.imageUrl || null,
    };
    return product;
  }

  // -----------------------------
  // UPDATE PRODUCT
  // -----------------------------
  async updateProduct(
    id: string,
    updateProductDto: ProductsDto.UpdateProductDto,
    userId: string,
  ): Promise<EditEntity> {
    // cek produk ada
    const product = await this.findProductByProductId(id);
    if (!product) {
      throw new BadRequestException('Produk tidak ditemukan');
    }

    // cek kategori tujuan (jika dikirim)
    if (updateProductDto.categoryId) {
      const [cat] = await this.defaultDb.query<any[]>(
        'SELECT * FROM category WHERE categoryId = ? LIMIT 1',
        [updateProductDto.categoryId],
      );
      if (!cat) {
        return {
          status: 400,
          message: 'Kategori tidak ada, gunakan kategori yang tersedia',
        };
      }
    }

    // update product fields
    const fields: string[] = [];
    const values: any[] = [];

    if (updateProductDto.name !== undefined) {
      fields.push('name = ?');
      values.push(updateProductDto.name);
    }
    if (updateProductDto.description !== undefined) {
      fields.push('description = ?');
      values.push(updateProductDto.description);
    }
    if (updateProductDto.price !== undefined) {
      fields.push('price = ?');
      values.push(updateProductDto.price);
    }
    if (updateProductDto.sku !== undefined) {
      fields.push('sku = ?');
      values.push(updateProductDto.sku);
    }
    if (updateProductDto.quantity !== undefined) {
      fields.push('quantity = ?');
      values.push(updateProductDto.quantity);
    }
    if (updateProductDto.categoryId !== undefined) {
      fields.push('categoryId = ?');
      values.push(updateProductDto.categoryId);
    }

    if (fields.length > 0) {
      const sql = `UPDATE product SET ${fields.join(', ')}, updatedAt = NOW() WHERE productId = ?`;
      values.push(id);
      await this.defaultDb.query(sql, values);
    }

    // update image jika ada
    if (updateProductDto.image) {
      // cek ada image record
      const [img] = await this.defaultDb.query<any[]>(
        'SELECT * FROM product_image WHERE productId = ? LIMIT 1',
        [id],
      );
      if (img) {
        await this.defaultDb.query(
          'UPDATE product_image SET imageUrl = ?, updatedAt = NOW() WHERE productId = ?',
          [updateProductDto.image, id],
        );
      } else {
        // insert baru
        const { v4: uuidv4 } = await import('uuid');

        const newImgId = uuidv4() || this.generateRandomCode('IMG');
        await this.defaultDb.query(
          'INSERT INTO product_image (ImageId, productId, imageUrl, createdAt) VALUES (?, ?, ?, NOW())',
          [newImgId, id, updateProductDto.image],
        );
      }
    }

    // simpan history di backup
    await this.backupDb.query(
      'INSERT INTO product_history (productId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())',
      [
        id,
        `Product diperbarui oleh ${userId} pada ${new Date().toISOString()}`,
        userId,
      ],
    );

    return {
      status: 200,
      message: `Produk dengan ID ${id} berhasil diperbarui`,
    };
  }

  // -----------------------------
  // REMOVE PRODUCT
  // -----------------------------
  async removeProduct(id: string): Promise<EditEntity> {
    // cek product ada
    const [prod] = await this.defaultDb.query<any[]>(
      'SELECT * FROM product WHERE productId = ? LIMIT 1',
      [id],
    );
    if (!prod) {
      throw new NotFoundException('Product not found');
    }

    // hapus gambar terkait
    await this.defaultDb.query(
      'DELETE FROM product_image WHERE productId = ?',
      [id],
    );

    // hapus product
    await this.defaultDb.query('DELETE FROM product WHERE productId = ?', [id]);

    // simpan history di backup
    await this.backupDb.query(
      'INSERT INTO product_history (productId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())',
      [id, `Product dihapus pada ${new Date().toISOString()}`, 'system'],
    );

    return { status: 200, message: `Produk dengan ID ${id} berhasil dihapus` };
  }

  // -----------------------------
  // CATEGORY: CREATE
  // -----------------------------
  async createCategory(
    createCategoryDto: ProductsDto.CreateCategoryDto,
    userid: string,
  ): Promise<CategoriesResponse> {
    // generate id
    createCategoryDto.categoryId = this.generateRandomCode('CTNEK');

    if (
      !createCategoryDto.name ||
      !createCategoryDto.categoryId ||
      !createCategoryDto.image
    ) {
      throw new BadRequestException('Name, categoryId and image are required');
    }

    // cek existing
    const [existing] = await this.defaultDb.query<any[]>(
      'SELECT * FROM category WHERE name = ? LIMIT 1',
      [createCategoryDto.name],
    );
    if (existing) {
      throw new ConflictException('Category already exists');
    }

    // insert category
    await this.defaultDb.query(
      'INSERT INTO category (categoryId, name, image, createdAt, updatedAt) VALUES (?, ?, ?, NOW(), NOW())',
      [
        createCategoryDto.categoryId,
        createCategoryDto.name,
        createCategoryDto.image,
      ],
    );

    // simpan history di backup
    await this.backupDb.query(
      'INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())',
      [
        createCategoryDto.categoryId,
        `Category dibuat oleh ${userid} pada ${new Date().toISOString()}`,
        userid,
      ],
    );

    return {
      status: 201,
      data: [
        {
          id: createCategoryDto.categoryId,
          name: createCategoryDto.name,
          image: createCategoryDto.image,
        },
      ],
    };
  }

  // -----------------------------
  // CATEGORY: FIND ALL
  // -----------------------------
  async findAllCategoriesNew(): Promise<CategoriesResponse> {
    const rows = await this.defaultDb.query<any[]>(
      'SELECT * FROM category ORDER BY name ASC',
    );
    const data: CategoriesData[] = rows.map((r) => ({
      id: r.categoryId,
      name: r.name,
      image: r.image,
    }));
    return { status: 200, data };
  }

  // -----------------------------
  // CATEGORY: FIND BY ID
  // -----------------------------
  async findCategoryById(id: string): Promise<CategoriesData> {
    const [row] = await this.defaultDb.query<any[]>(
      'SELECT * FROM category WHERE categoryId = ? LIMIT 1',
      [id],
    );
    if (!row) {
      throw new NotFoundException('Category not found');
    }
    return { id: row.categoryId, name: row.name, image: row.image };
  }

  // -----------------------------
  // CATEGORY: UPDATE
  // -----------------------------
  async updateCategory(
    id: string,
    updateCategoryDto: ProductsDto.UpdateCategoryDto,
    userid: string,
  ): Promise<EditEntity> {
    const [existing] = await this.defaultDb.query<any[]>(
      'SELECT * FROM category WHERE categoryId = ? LIMIT 1',
      [id],
    );
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // update
    await this.defaultDb.query(
      'UPDATE category SET name = ?, image = ?, updatedAt = NOW() WHERE categoryId = ?',
      [
        updateCategoryDto.name || existing.name,
        updateCategoryDto.image || existing.image,
        id,
      ],
    );

    // history
    await this.backupDb.query(
      'INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())',
      [
        id,
        `Category diperbarui oleh ${userid} pada ${new Date().toISOString()}`,
        userid,
      ],
    );

    return {
      status: 200,
      message: `Kategori dengan ID ${id} berhasil diperbarui`,
    };
  }

  // -----------------------------
  // CATEGORY: REMOVE
  // -----------------------------
  async removeCategory(id: string, userId: string): Promise<EditEntity> {
    const [existing] = await this.defaultDb.query<any[]>(
      'SELECT * FROM category WHERE categoryId = ? LIMIT 1',
      [id],
    );
    if (!existing) {
      throw new NotFoundException('Category not found');
    }

    // Optional: cek produk di kategori tersebut (jika mau block delete)
    // const related = await this.defaultDb.query<any[]>('SELECT COUNT(*) as cnt FROM product WHERE categoryId = ?', [id]);
    // if (related[0]?.cnt > 0) { throw new BadRequestException('Category has products'); }

    await this.defaultDb.query('DELETE FROM category WHERE categoryId = ?', [
      id,
    ]);

    await this.backupDb.query(
      'INSERT INTO category_history (categoryId, pesan, userId, createdAt) VALUES (?, ?, ?, NOW())',
      [
        id,
        `Category dihapus oleh ${userId} pada ${new Date().toISOString()}`,
        userId,
      ],
    );

    return {
      status: 200,
      message: `Kategori dengan ID ${id} berhasil dihapus`,
    };
  }

  // -----------------------------
  // SEARCH PRODUCTS
  // -----------------------------
  async searchProducts(query: string): Promise<Product[]> {
    const rows = await this.defaultDb.query<any[]>(
      'SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity, i.imageUrl FROM product p LEFT JOIN product_image i ON p.productId = i.productId WHERE p.name LIKE ? OR p.description LIKE ?',
      [`%${query}%`, `%${query}%`],
    );
    return rows.map((r) => ({
      id: r.productId,
      productId: r.productId,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      sku: r.sku,
      quantity: Number(r.quantity),
      categoryId: r.categoryId || null,
      image: r.imageUrl || null,
    }));
  }

  // -----------------------------
  // FILTER PRODUCTS
  // -----------------------------
  async filterProducts(
    categoryId?: string,
    minPrice?: number,
    maxPrice?: number,
    minRating?: number,
    maxRating?: number,
  ): Promise<Product[]> {
    let sql = `SELECT p.productId, p.name, p.description, p.price, p.sku, p.quantity, i.imageUrl FROM product p LEFT JOIN product_image i ON p.productId = i.productId WHERE 1=1`;
    const params: any[] = [];

    if (categoryId) {
      sql += ' AND p.categoryId = ?';
      params.push(categoryId);
    }
    if (minPrice !== undefined) {
      sql += ' AND p.price >= ?';
      params.push(minPrice);
    }
    if (maxPrice !== undefined) {
      sql += ' AND p.price <= ?';
      params.push(maxPrice);
    }
    if (minRating !== undefined) {
      sql += ' AND p.rating >= ?';
      params.push(minRating);
    }
    if (maxRating !== undefined) {
      sql += ' AND p.rating <= ?';
      params.push(maxRating);
    }
    const rows = await this.defaultDb.query<any[]>(sql, params);
    return rows.map((r) => ({
      id: r.productId,
      productId: r.productId,
      name: r.name,
      description: r.description,
      price: Number(r.price),
      sku: r.sku,
      quantity: Number(r.quantity),
      categoryId: r.categoryId || null,
      image: r.imageUrl || null,
    }));
  }
}
