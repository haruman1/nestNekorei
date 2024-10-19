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
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addItem(
    @Req() req: Request & { user: JwtPayload },
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addItem(req.user.userId, createCartItemDto);
  }

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

  @Delete('remove/:itemId')
  removeItem(
    @Req() req: Request & { user: JwtPayload },
    @Param('itemId') itemId: number,
  ) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @Get('summary')
  getCartSummary(@Req() req: Request & { user: JwtPayload }) {
    return this.cartService.getCartSummary(req.user.userId);
  }

  @Post('checkout')
  async checkout(@Req() req: Request & { user: JwtPayload }) {
    const cart = await this.cartService.getCartSummary(req.user.userId);
    // Integrate the order placement and payment here
    await this.cartService.clearCart(req.user.userId);
    return { message: 'Checkout successful' };
  }
}
