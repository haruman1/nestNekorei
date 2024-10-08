"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const common_1 = require("@nestjs/common");
const order_entity_1 = require("../orders/order.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let InvoicesService = class InvoicesService {
    constructor(ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    async generateHeader(doc) {
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
    async generateFooter(doc) {
        doc
            .fontSize(10)
            .text('Payment is due within 30 days. Thank you for your business.', 50, 780, { align: 'center', width: 500 });
    }
    async generateCustomerInformation(doc, invoice) {
        const shipping = invoice.shipping;
        doc
            .text('Invoice Number: ' + invoice.orderId, 50, 200)
            .text('Invoice Date: ' + invoice.date, 50, 220)
            .text(`Balance Due: ${invoice.subtotal - invoice.paid}`, 50, 130)
            .text(shipping.name, 300, 200)
            .text(shipping.address, 300, 215)
            .text(`${shipping.city}, ${shipping.state}, ${shipping.country}`, 300, 130)
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
        let i, invoiceTableTop = 330;
        for (i = 0; i < invoice.items.length; i++) {
            const item = invoice.items[i];
            const position = invoiceTableTop + (i + 1) * 30;
            this.generateTableRow(doc, position, item.item, item.description, item.amount / item.quantity, item.quantity, item.amount);
        }
    }
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
};
exports.InvoicesService = InvoicesService;
exports.InvoicesService = InvoicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], InvoicesService);
//# sourceMappingURL=invoices.service.js.map