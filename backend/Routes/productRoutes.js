import express from 'express';
import { create, list, status } from '../controllers/productController.js';

const router = express.Router();

router.get('/', list);
router.post('/', create);
router.get('/:productId/status', status);

export default router;
