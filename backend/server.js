import express from 'express';
import { connectDB } from './config/database.js';
import './config/redis.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import cors from 'cors';
const app = express();

app.use(express.json());
app.use(apiLimiter);
app.use(cors());
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);

app.use(errorHandler);

await connectDB();

app.listen(5000, () => console.log('Server is running on port 5000'));