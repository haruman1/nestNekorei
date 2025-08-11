// import { Controller, Post, Body, Param, Req, UseGuards } from '@nestjs/common';

// import { PaymentService } from './payment.service';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

// @Controller('payment')
// export class PaymentController {
//   constructor(private readonly paymentservice: PaymentService) {}
//   @UseGuards(JwtAuthGuard)
//   @Post('create')
//   createPayment(@Body() body: { orderID: string }) {
//     return this.paymentservice.createPayment(body.orderID);
//   }
//   @Post('history')
//   PaymentTransaction(@Body() payload: any) {
//     return this.paymentservice.PaymentTransaction(payload);
//   }
// }
import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { createPaymentHitory } from './dto/create-transasction.dto'; // Pastikan path DTO benar

@ApiTags('Payment') // Mengelompokkan semua endpoint di bawah tag 'Payment'
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentservice: PaymentService) {}

  @ApiBearerAuth() // Menandakan endpoint ini butuh otentikasi Bearer Token
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiOperation({ summary: 'Membuat sesi pembayaran untuk sebuah pesanan' })
  @ApiBody({ type: createPaymentHitory }) // Mendefinisikan body yang diharapkan
  @ApiResponse({
    status: 201,
    description:
      'Berhasil membuat sesi pembayaran (misal: redirect URL atau token Snap Midtrans).',
  })
  @ApiResponse({ status: 401, description: 'Tidak terautentikasi.' })
  @ApiResponse({ status: 404, description: 'Order ID tidak ditemukan.' })
  createPayment(@Body() createPaymentDto: createPaymentHitory) {
    // Menggunakan DTO untuk validasi dan kejelasan
    return this.paymentservice.createPayment(createPaymentDto.orderId);
  }

  @Post('history')
  @ApiOperation({
    summary: 'Endpoint untuk menerima notifikasi/webhook dari payment gateway',
    description:
      'Endpoint ini tidak memerlukan otentikasi karena diakses oleh server payment gateway (misal: Midtrans).',
  })
  @ApiBody({
    description: 'Payload notifikasi dari payment gateway.',
    type: 'object',
    examples: {
      success: {
        summary: 'Contoh notifikasi sukses',
        value: {
          transaction_time: '2023-10-27 14:00:00',
          transaction_status: 'settlement',
          order_id: 'ORD-20231027-001',
          payment_type: 'qris',
          gross_amount: '50000.00',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Notifikasi berhasil diterima dan diproses.',
  })
  PaymentTransaction(@Body() payload: any) {
    return this.paymentservice.PaymentTransaction(payload);
  }
}
