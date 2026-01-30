import Product from '../models/Product.js';
import { getTotalReservedStock } from './reservationService.js';

export const getProducts = async () => {
  const products = await Product.find();
  const result = [];
  for (const p of products) {
    const reserved = await getTotalReservedStock(p._id.toString());
    result.push({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      stock: p.stock,
      price: p.price,
      reservedStock: reserved,
      availableStock: p.stock - reserved
    });
  }
  return result;
};

export const createProduct = async (data) => {
  const product = new Product(data);
  return await product.save();
};

export const getProductStatus = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const reserved = await getTotalReservedStock(productId);
  const available = product.stock - reserved;

  return {
    productId: product._id,
    name: product.name,
    sku: product.sku,
    totalStock: product.stock,
    reservedStock: reserved,
    availableStock: available
  };
};
