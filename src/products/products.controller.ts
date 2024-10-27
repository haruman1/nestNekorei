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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  // createProduct(@Body() createProductDto: CreateProductDto) {
  //   return this.productsService.createProduct(createProductDto, CategoryId);
  // }

  @Post()
  createProduct(
    @Req() req: Request & { user: JwtPayload },
    @Body()
    body: {
      categoryId: string;
    },
    @Body() createProductDto: CreateProductDto,
  ) {
    createProductDto.productId =
      this.productsService.generateRandomCode('PRDNK');

    return this.productsService.createProduct(
      createProductDto,
      body.categoryId,
      req.user.userId,
    );
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  // @Get(':id')
  // findProductById(@Param('id') id: string) {
  //   return this.productsService.findProductById(id);
  // }

  @Patch(':id')
  updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  // @Delete(':id')
  // removeProduct(@Param('id') id: string) {
  //   return this.productsService.removeProduct(id);
  // }

  @Post('categories')
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

  @Get('categories')
  findCategoriesAll() {
    return this.productsService.findAllCategoriesNew();
  }

  // @Get('categories/:id')
  // findCategoryById(@Param('id') id: string) {
  //   return this.productsService.findCategoryById(id);
  // }

  @Patch('categories/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  removeCategory(@Param('id') id: string) {
    return this.productsService.removeCategory(id);
  }
  @Get('search')
  searchProducts(@Query('query') query: string) {
    return this.productsService.searchProducts(query);
  }

  @Get('filter')
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
}
