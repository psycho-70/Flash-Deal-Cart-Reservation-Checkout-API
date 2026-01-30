import { reserveProduct, reserveMultipleProducts, cancelReservation } from '../services/reservationService.js';

export const reserve = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const { productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await reserveProduct(userId, productId, quantity);
    res.json({ message: 'Product reserved', ...result });
  } catch (error) {
    next(error);
  }
};

export const reserveMultiple = async (req, res, next) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const results = await reserveMultipleProducts(userId, items);
    res.json({ message: 'Products reserved', items: results });
  } catch (error) {
    next(error);
  }
};

export const cancel = async (req, res, next) => {
  try {
    const { userId, productId } = req.body;
    if (!userId || !productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    await cancelReservation(userId, productId);
    res.json({ message: 'Reservation cancelled' });
  } catch (error) {
    next(error);
  }
};
