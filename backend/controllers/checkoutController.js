import { checkoutReservation } from '../services/reservationService.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const checkout = async (req, res, next) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process checkout for each item
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      await checkoutReservation(userId, item.productId, item.quantity);
      
      const product = await Product.findById(item.productId);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      orderItems.push({
        productId: item.productId,
        sku: product.sku,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order
    const order = new Order({
      userId,
      items: orderItems,
      total
    });

    await order.save();

    res.json({ message: 'Checkout successful', order });
  } catch (error) {
    next(error);
  }
};
