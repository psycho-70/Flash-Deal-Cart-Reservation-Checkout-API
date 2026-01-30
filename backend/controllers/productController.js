import { createProduct, getProductStatus, getProducts } from '../services/productService.js';

export const list = async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const { name, sku, stock, price } = req.body;
    if (!name || !sku || stock === undefined || price === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const product = await createProduct({ name, sku, stock, price });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const status = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const status = await getProductStatus(productId);
    res.json(status);
  } catch (error) {
    next(error);
  }
};
