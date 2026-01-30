import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
