import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  order_Id: string;
  @Column()
  Merchant_Id: string;
  @Column()
  time: string;
  @Column()
  transaction_Id: string;
  @Column()
  transaction_status: string;
  @Column()
  acquirer: string;
  @Column()
  expiry_time: string;
  @Column()
  gross_amount: string;
  @Column()
  issuer: string;
  @Column()
  payment_type: string;
  @Column()
  status_message: string;
}
