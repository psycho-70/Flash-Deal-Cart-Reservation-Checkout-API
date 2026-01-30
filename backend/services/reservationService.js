import redisClient from '../config/redis.js';
import Product from '../models/Product.js';

const RESERVATION_TTL = 600; // 10 minutes in seconds

export const reserveProduct = async (userId, productId, quantity) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const reservedKey = `reservation:${userId}:${productId}`;
  const stockKey = `stock:${productId}`;

  // Check current reserved quantity for this user
  const existingReservation = await redisClient.get(reservedKey);
  const currentReserved = existingReservation ? parseInt(existingReservation) : 0;

  // Get total reserved stock for this product
  const totalReserved = await getTotalReservedStock(productId);

  // Calculate available stock
  const available = product.stock - totalReserved;

  if (quantity > available) {
    throw new Error(`Insufficient stock. Available: ${available}`);
  }

  // Update reservation
  const newReserved = currentReserved + quantity;
  await redisClient.setEx(reservedKey, RESERVATION_TTL, newReserved.toString());

  return { reserved: newReserved, expiresIn: RESERVATION_TTL };
};

export const reserveMultipleProducts = async (userId, items) => {
  const results = [];
  const reservedKeys = [];

  try {
    // Validate all products first
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const totalReserved = await getTotalReservedStock(item.productId);
      const available = product.stock - totalReserved;

      if (item.quantity > available) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${available}`);
      }
    }

    // Reserve all products
    for (const item of items) {
      const reservedKey = `reservation:${userId}:${item.productId}`;
      const existingReservation = await redisClient.get(reservedKey);
      const currentReserved = existingReservation ? parseInt(existingReservation) : 0;
      const newReserved = currentReserved + item.quantity;

      await redisClient.setEx(reservedKey, RESERVATION_TTL, newReserved.toString());
      reservedKeys.push(reservedKey);
      results.push({ productId: item.productId, reserved: newReserved });
    }

    return results;
  } catch (error) {
    // Rollback on failure
    for (const key of reservedKeys) {
      await redisClient.del(key);
    }
    throw error;
  }
};

export const cancelReservation = async (userId, productId) => {
  const reservedKey = `reservation:${userId}:${productId}`;
  const deleted = await redisClient.del(reservedKey);
  if (deleted === 0) throw new Error('Reservation not found');
  return { cancelled: true };
};

export const getTotalReservedStock = async (productId) => {
  const pattern = `reservation:*:${productId}`;
  const keys = await redisClient.keys(pattern);
  
  let total = 0;
  for (const key of keys) {
    const value = await redisClient.get(key);
    if (value) total += parseInt(value);
  }
  return total;
};

export const checkoutReservation = async (userId, productId, quantity) => {
  const reservedKey = `reservation:${userId}:${productId}`;
  const reserved = await redisClient.get(reservedKey);
  
  if (!reserved || parseInt(reserved) < quantity) {
    throw new Error('Reservation expired or insufficient quantity');
  }

  // Remove reservation
  await redisClient.del(reservedKey);
  
  // Update product stock
  await Product.findByIdAndUpdate(productId, {
    $inc: { stock: -quantity }
  });

  return { success: true };
};
