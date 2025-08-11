// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Patch,
//   Delete,
//   UseGuards,
//   BadRequestException,
//   Query,
//   Req,
// } from '@nestjs/common';
// import { ProductsService } from './products.service';
// import { CreateProductDto } from './dto/create-product.dto';
// import { UpdateProductDto } from './dto/update-product.dto';
// import { CreateCategoryDto } from './dto/create-category.dto';
// import { UpdateCategoryDto } from './dto/update-category.dto';
// import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
// import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

// @Controller('products')
// @UseGuards(JwtAuthGuard)
// export class ProductsController {
//   constructor(private readonly productsService: ProductsService) {}

//   // @Post()
//   // createProduct(@Body() createProductDto: CreateProductDto) {
//   //   return this.productsService.createProduct(createProductDto, CategoryId);
//   // }

//   @Post()
//   createProduct(
//     @Req() req: Request & { user: JwtPayload },
//     @Body()
//     body: {
//       categoryId: string;
//     },
//     @Body() createProductDto: CreateProductDto,
//   ) {
//     createProductDto.productId =
//       this.productsService.generateRandomCode('PRDNK');

//     return this.productsService.createProduct(
//       createProductDto,
//       body.categoryId,
//       req.user.userId,
//     );
//   }

//   @Get()
//   findAllProducts() {
//     return this.productsService.findAllProducts();
//   }

//   // @Get(':id')
//   // findProductById(@Param('id') id: string) {
//   //   return this.productsService.findProductById(id);
//   // }

//   @Patch(':id')
//   updateProduct(
//     @Param('id') id: string,
//     @Body() updateProductDto: UpdateProductDto,
//     @Req() req: Request & { user: JwtPayload },
//   ) {
//     return this.productsService.updateProduct(
//       id,
//       updateProductDto,
//       req.user.userId,
//     );
//   }

//   @Delete(':id')
//   removeProduct(@Param('id') id: string) {
//     return this.productsService.removeProduct(id);
//   }

//   @Post('categories')
//   createCategory(
//     @Body() createCategoryDto: CreateCategoryDto,
//     @Req() req: Request & { user: JwtPayload },
//   ) {
//     if (!createCategoryDto.name) {
//       throw new BadRequestException('Please provide a Valid Input');
//     }
//     return this.productsService.createCategory(
//       createCategoryDto,
//       req.user.userId,
//     );
//   }

//   @Get('categories')
//   findCategoriesAll() {
//     return this.productsService.findAllCategoriesNew();
//   }

//   // @Get('categories/:id')
//   // findCategoryById(@Param('id') id: string) {
//   //   return this.productsService.findCategoryById(id);
//   // }

//   @Patch('categories/:id')
//   updateCategory(
//     @Param('id') id: string,
//     @Body() updateCategoryDto: UpdateCategoryDto,
//     @Req() req: Request & { user: JwtPayload },
//   ) {
//     return this.productsService.updateCategory(
//       id,
//       updateCategoryDto,
//       req.user.userId,
//     );
//   }

//   @Delete('categories/:id')
//   removeCategory(
//     @Param('id') id: string,
//     @Req() req: Request & { user: JwtPayload },
//   ) {
//     return this.productsService.removeCategory(id, req.user.userId);
//   }
//   @Get('search')
//   searchProducts(@Query('query') query: string) {
//     return this.productsService.searchProducts(query);
//   }

//   @Get('filter')
//   filterProducts(
//     @Query('categoryId') categoryId?: number,
//     @Query('minPrice') minPrice?: number,
//     @Query('maxPrice') maxPrice?: number,
//     @Query('minRating') minRating?: number,
//   ) {
//     return this.productsService.filterProducts(
//       categoryId,
//       minPrice,
//       maxPrice,
//       minRating,
//     );
//   }
// }
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  BadRequestException,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

// Menambahkan autentikasi Bearer untuk semua endpoint di controller ini
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- PRODUCTS ENDPOINTS ---

  @ApiTags('Products')
  @Post()
  @ApiOperation({ summary: 'Membuat produk baru' })
  @ApiResponse({ status: 201, description: 'Produk berhasil dibuat.' })
  @ApiResponse({ status: 400, description: 'Input tidak valid.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  createProduct(
    @Req() req: Request & { user: JwtPayload },
    // Menggunakan satu DTO untuk body
    @Body() createProductDto: CreateProductDto,
  ) {
    // Generate kode produk di dalam service untuk konsistensi
    return this.productsService.createProduct(
      createProductDto,
      String(createProductDto.categoryId), // Diambil dari DTO
      req.user.userId,
    );
  }

  @ApiTags('Products')
  @Get()
  @ApiOperation({ summary: 'Mendapatkan semua daftar produk' })
  @ApiResponse({ status: 200, description: 'Berhasil mengambil data produk.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @ApiTags('Products')
  @Get('search')
  @ApiOperation({ summary: 'Mencari produk berdasarkan kata kunci' })
  @ApiQuery({
    name: 'query',
    required: true,
    type: String,
    description: 'Kata kunci untuk pencarian produk',
  })
  @ApiResponse({ status: 200, description: 'Hasil pencarian produk.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  searchProducts(@Query('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @ApiTags('Products')
  @Get('filter')
  @ApiOperation({ summary: 'Filter produk berdasarkan kriteria' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: Number,
    description: 'Filter berdasarkan ID kategori',
  })
  @ApiQuery({
    name: 'minPrice',
    required: false,
    type: Number,
    description: 'Harga minimum',
  })
  @ApiQuery({
    name: 'maxPrice',
    required: false,
    type: Number,
    description: 'Harga maksimum',
  })
  @ApiQuery({
    name: 'minRating',
    required: false,
    type: Number,
    description: 'Rating minimum (1-5)',
  })
  @ApiResponse({ status: 200, description: 'Hasil filter produk.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  filterProducts(
    @Query('categoryId') categoryId?: number,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('minRating') minRating?: number,
  ) {
    return this.productsService.filterProducts(
      categoryId,
      minPrice,
      maxPrice,
      minRating,
    );
  }

  @ApiTags('Products')
  @Patch(':id')
  @ApiOperation({ summary: 'Memperbarui data produk berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID unik produk', type: String })
  @ApiResponse({ status: 200, description: 'Produk berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.productsService.updateProduct(
      id,
      updateProductDto,
      req.user.userId,
    );
  }

  @ApiTags('Products')
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Menghapus produk berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID unik produk', type: String })
  @ApiResponse({ status: 204, description: 'Produk berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Produk tidak ditemukan.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  removeProduct(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }

  // --- CATEGORIES ENDPOINTS ---

  @ApiTags('Categories')
  @Post('categories')
  @ApiOperation({ summary: 'Membuat kategori produk baru' })
  @ApiResponse({ status: 201, description: 'Kategori berhasil dibuat.' })
  @ApiResponse({ status: 400, description: 'Input tidak valid.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    if (!createCategoryDto.name) {
      throw new BadRequestException('Please provide a Valid Input');
    }
    return this.productsService.createCategory(
      createCategoryDto,
      req.user.userId,
    );
  }

  @ApiTags('Categories')
  @Get('categories')
  @ApiOperation({ summary: 'Mendapatkan semua daftar kategori' })
  @ApiResponse({
    status: 200,
    description: 'Berhasil mengambil data kategori.',
  })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  findCategoriesAll() {
    return this.productsService.findAllCategoriesNew();
  }

  @ApiTags('Categories')
  @Patch('categories/:id')
  @ApiOperation({ summary: 'Memperbarui kategori berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID unik kategori', type: String })
  @ApiResponse({ status: 200, description: 'Kategori berhasil diperbarui.' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.productsService.updateCategory(
      id,
      updateCategoryDto,
      req.user.userId,
    );
  }

  @ApiTags('Categories')
  @Delete('categories/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Menghapus kategori berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID unik kategori', type: String })
  @ApiResponse({ status: 204, description: 'Kategori berhasil dihapus.' })
  @ApiResponse({ status: 404, description: 'Kategori tidak ditemukan.' })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  removeCategory(
    @Param('id') id: string,
    @Req() req: Request & { user: JwtPayload },
  ) {
    return this.productsService.removeCategory(id, req.user.userId);
  }
}
