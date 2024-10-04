import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PaymentHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  transaction_type: string;
  @Column()
  transaction_time: string;
  @Column()
  transaction_status: string;
  @Column()
  transaction_id: string;
  @Column()
  status_message: string;
  @Column()
  status_code: string;
  @Column()
  signature_key: string;
  @Column()
  settlement_time: string;
  @Column()
  payment_type: string;
  @Column()
  order_id: string;
  @Column()
  merchant_id: string;
  @Column()
  issuer: string;
  @Column()
  gross_amount: string;
  @Column()
  fraud_status: string;
  @Column()
  acquirer: string;
  @Column()
  currency: string;
}
