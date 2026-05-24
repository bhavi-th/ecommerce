import express from 'express';
import { getCart, addToCart, removeFromCart, updateCartQuantity, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, getCart).post(protect, addToCart).delete(protect, clearCart);
router.route('/:productId').delete(protect, removeFromCart).put(protect, updateCartQuantity);

export default router;
