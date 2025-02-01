// src/server.ts
import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config();

const app: Application = express();


app.use(express.json());
app.use(cors());


const mongoURI: string = process.env.MONGODB_URI || 'mongodb://localhost:27017/transactionsDB';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));


import transactionRoutes from './routes/transactionRoutes';
app.use('/api', transactionRoutes);

const PORT: number = Number(process.env.PORT) || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
