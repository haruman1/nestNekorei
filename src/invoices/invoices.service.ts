import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from '../orders/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}
  async generateHeader(doc: any) {
    doc
      .image('logo.png', 50, 45, { width: 50 })
      .fillColor('#444444')
      .fontSize(20)
      .text('Nekorei Invoice', 110, 57)
      .fontSize(10)
      .text('xxxx', 200, 50, { align: 'right' })
      .text('xxx1', 200, 50, { align: 'right' })
      .text('xx2', 200, 50, { align: 'right' })
      .moveDown();
  }
  async generateFooter(doc: any) {
    doc
      .fontSize(10)
      .text(
        'Payment is due within 30 days. Thank you for your business.',
        50,
        780,
        { align: 'center', width: 500 },
      );
  }
  async generateCustomerInformation(doc, invoice) {
    const shipping = invoice.shipping;

    doc
      .text('Invoice Number: ' + invoice.orderId, 50, 200)
      .text('Invoice Date: ' + invoice.date, 50, 220)
      .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)
      .text(shipping.name, 300, 200)
      .text(shipping.address, 300, 215)
      .text(
        `${shipping.city}, ${shipping.state}, ${shipping.country}`,
        300,
        130,
      )
      .moveDown();
  }
  async generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc
      .fontSize(10)
      .text(c1, 50, y)
      .text(c2, 150, y)
      .text(c3, 280, y, { width: 90, align: 'right' })
      .text(c4, 370, y, { width: 90, align: 'right' })
      .text(c5, 0, y, { align: 'right' });
  }
  async generateInvoiceTable(doc, invoice) {
    let i,
      invoiceTableTop = 330;

    for (i = 0; i < invoice.items.length; i++) {
      const item = invoice.items[i];
      const position = invoiceTableTop + (i + 1) * 30;
      this.generateTableRow(
        doc,
        position,
        item.item,
        item.description,
        item.amount / item.quantity,
        item.quantity,
        item.amount,
      );
    }
  }
  //   async generateInvoice(orderId: number): Promise<string> {
  //     try {
  //       const order = await this.ordersRepository.findOne({
  //         where: { id: orderId },
  //         relations: ['user', 'items', 'items.product'],
  //       });
  //       if (!order) {
  //         throw new NotFoundException('Order not found');
  //       }
  //       const invoiceData = {
  //         orderId: order.id,
  //         customer: {
  //           name: order.user.name,
  //           email: order.user.email,
  //         },
  //         items: order.items.map((item) => ({
  //           name: item.product.name,
  //           quantity: item.quantity,
  //           price: item.price,
  //         })),
  //         total: order.total,
  //         date: order.createdAt,
  //       };
  //       console.log('Generating invoice...');
  //       return await this.createInvoice(invoiceData, 'invoice.pdf');
  //     } catch (error) {
  //       console.error('Error generating invoice:', error);
  //     }
  //   }
  async createInvoice(invoice, path) {
    const fs = require('fs');
    const PDFDocument = require('pdfkit');

    let doc = new PDFDocument({ margin: 50 });

    this.generateHeader(doc);
    this.generateFooter(doc);
    doc.end();
    doc.pipe(fs.createWriteStream(path));
    return new Promise((resolve, reject) => {
      doc.end();
      doc.pipe(fs.createWriteStream(path));
      doc.on('end', () => {
        resolve(path);
      });
      doc.on('error', (error) => {
        reject(error);
      });
    });
  }
}
