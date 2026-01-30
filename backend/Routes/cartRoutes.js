import express from 'express';
import { reserve, reserveMultiple, cancel } from '../controllers/cartController.js';

const router = express.Router();

router.post('/reserve', reserve);
router.post('/reserve-multiple', reserveMultiple);
router.post('/cancel', cancel);

export default router;
