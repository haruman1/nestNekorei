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
import { CurrentUser } from '../auth/jwt/current-user.decorator';
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addItem(
    @CurrentUser() user: any,
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    const userId = user.id;
    return this.cartService.addItem(userId, createCartItemDto);
  }

  @Patch('update/:itemId')
  updateItem(
    @CurrentUser() user: any,
    @Param('itemId') itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    const userId = user.id;
    return this.cartService.updateItem(userId, itemId, updateCartItemDto);
  }

  @Delete('remove/:itemId')
  removeItem(@CurrentUser() user: any, @Param('itemId') itemId: number) {
    const userId = user.id;
    return this.cartService.removeItem(userId, itemId);
  }

  @Get('summary')
  getCartSummary(@CurrentUser() user: any) {
    const userId = user.id;
    return this.cartService.getCartSummary(userId);
  }

  @Post('checkout')
  async checkout(@CurrentUser() user: any) {
    const userId = user.id;
    const cart = await this.cartService.getCartSummary(userId);
    // Integrate the order placement and payment here
    await this.cartService.clearCart(userId);
    return { message: 'Checkout successful' };
  }
}
