
import axios from 'axios';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction, { ITransaction } from './models/Transaction';

dotenv.config();

const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/transactionsDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB connected for seeding'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    
    const response = await axios.get<ITransaction[]>('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    const transactions = response.data;

    
    await Transaction.deleteMany({});
   
    await Transaction.insertMany(transactions);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
