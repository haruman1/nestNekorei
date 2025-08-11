import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @ApiTags('Cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to the cart successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Item already exists in the cart',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: CreateCartItemDto }) // Mendefinisikan body yang diharapkan
  @Post('add')
  addItem(
    @Req() req: Request & { user: JwtPayload },
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addItem(req.user.userId, createCartItemDto);
  }
  @ApiTags('Cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an item in the cart' })
  @ApiResponse({
    status: 200,
    description: 'Item updated successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found in the cart',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: UpdateCartItemDto }) // Mendefinisikan body yang diharapkan
  @Patch('update/:itemId')
  updateItem(
    @Req() req: Request & { user: JwtPayload },
    @Param('itemId') itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      req.user.userId,
      itemId,
      updateCartItemDto,
    );
  }
  @ApiTags('Cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from the cart successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Item not found in the cart',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: Number }) // Mendefinisikan parameter ID yang diharapkan
  @Delete('remove/:itemId')
  removeItem(
    @Req() req: Request & { user: JwtPayload },
    @Param('itemId') itemId: number,
  ) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }
  @ApiTags('Cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get total price of all items in the cart' })
  @ApiResponse({
    status: 200,
    description: 'List of all items in the cart.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Get('summary')
  getCartSummary(@Req() req: Request & { user: JwtPayload }) {
    return this.cartService.getCartSummary(req.user.userId);
  }
  @ApiTags('Cart')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Checkout the cart' })
  @ApiResponse({
    status: 200,
    description: 'Checkout successful, cart cleared.',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 404,
    description: 'Cart not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @ApiBody({ type: Number }) // Mendefinisikan parameter ID yang diharapkan
  @Post('checkout')
  async checkout(@Req() req: Request & { user: JwtPayload }) {
    const cart = await this.cartService.getCartSummary(req.user.userId);
    // Integrate the order placement and payment here
    await this.cartService.clearCart(req.user.userId);
    return { message: 'Checkout successful' };
  }
}
