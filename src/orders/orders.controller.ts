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
interface JwtPayload {
  userId: string;
  name: string;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request & { user: JwtPayload },
  ) {
    createOrderDto.userId = req.user.userId;
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  findAllOrders() {
    return this.ordersService.findAllOrders();
  }

  @Get(':id')
  findOrderById(@Param('id') id: number) {
    return this.ordersService.findOrderById(id);
  }

  @Patch(':id/status')
  updateOrderStatus(
    @Param('id') id: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  removeOrder(@Param('id') id: number) {
    return this.ordersService.removeOrder(id);
  }
}
