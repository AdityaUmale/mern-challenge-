
import { Schema, model, Document } from 'mongoose';

export interface ITransaction extends Document {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sold: boolean;
  dateOfSale: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String },
  image: { type: String },
  sold: { type: Boolean, default: false },
  dateOfSale: { type: Date, required: true },
});

export default model<ITransaction>('Transaction', TransactionSchema);
