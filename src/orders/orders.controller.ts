import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { JwtPayload } from 'src/auth/jwt/jwt-payload.interface';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}
  @ApiTags('Orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({ type: CreateOrderDto }) // Mendefinisikan body yang diharapkan
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
  })
  // Mengelompokkan semua endpoint di bawah tag 'Orders'
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    createOrderDto.userId = req.user.userId;
    return this.ordersService.createOrder(createOrderDto);
  }
  @ApiTags('Orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({
    status: 200,
    description: 'List of all orders.',
  })
  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }
  @ApiTags('Orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({
    status: 200,
    description: 'Order found.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiBody({ type: Number }) // Mendefinisikan parameter ID yang diharapkan
  @Get(':id')
  findOrderById(@Param('id') id: number) {
    return this.ordersService.findOrderById(id);
  }
  @ApiTags('Orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({
    status: 200,
    description: 'Order status updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiBody({ type: UpdateOrderStatusDto }) // Mendefinisikan body yang diharapkan
  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }
  @ApiTags('Orders')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an order' })
  @ApiResponse({
    status: 200,
    description: 'Order deleted successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Order not found.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiBody({ type: Number }) // Mendefinisikan parameter ID yang diharapkan
  @Delete(':id')
  removeOrder(@Param('id') id: number) {
    return this.ordersService.removeOrder(id);
  }
}
