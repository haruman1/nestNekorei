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
  ParseIntPipe,
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
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOperation({ summary: 'Add an item to the cart' })
  @ApiResponse({
    status: 201,
    description: 'Item added to the cart successfully.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiBody({ type: CreateCartItemDto })
  @Post('add')
  addItem(
    @Req() req: Request & { user: JwtPayload },
    @Body() createCartItemDto: CreateCartItemDto,
  ) {
    return this.cartService.addCartItem(req.user.userId, createCartItemDto);
  }

  @ApiOperation({ summary: 'Update an item in the cart' })
  @ApiResponse({ status: 200, description: 'Item updated successfully.' })
  @ApiResponse({ status: 404, description: 'Item not found in the cart' })
  @ApiBody({ type: UpdateCartItemDto })
  @ApiParam({ name: 'itemId', type: Number, description: 'Cart item ID' })
  @Patch('update/:itemId')
  updateItem(
    @Req() req: Request & { user: JwtPayload },
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(
      req.user.userId,
      itemId,
      updateCartItemDto,
    );
  }

  @ApiOperation({ summary: 'Remove an item from the cart' })
  @ApiResponse({
    status: 200,
    description: 'Item removed from the cart successfully.',
  })
  @ApiResponse({ status: 404, description: 'Item not found in the cart' })
  @ApiParam({ name: 'itemId', type: Number, description: 'Cart item ID' })
  @Delete('remove/:itemId')
  removeItem(
    @Req() req: Request & { user: JwtPayload },
    @Param('itemId', ParseIntPipe) itemId: number,
  ) {
    return this.cartService.removeItem(req.user.userId, itemId);
  }

  @ApiOperation({ summary: 'Get total price of all items in the cart' })
  @ApiResponse({ status: 200, description: 'List of all items in the cart.' })
  @Get('summary')
  getCartSummary(@Req() req: Request & { user: JwtPayload }) {
    return this.cartService.getCartSummary(req.user.userId);
  }

  @ApiOperation({ summary: 'Checkout the cart' })
  @ApiResponse({
    status: 200,
    description: 'Checkout successful, cart cleared.',
  })
  @Post('checkout')
  async checkout(@Req() req: Request & { user: JwtPayload }) {
    const cart = await this.cartService.getCartSummary(req.user.userId);
    // Integrasi order placement / payment di sini
    await this.cartService.clearCart(req.user.userId);
    return { message: 'Checkout successful', cart };
  }
}
