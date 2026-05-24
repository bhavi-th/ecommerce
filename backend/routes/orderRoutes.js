import express from 'express';
import { createOrder, getOrders, getOrderById, updateOrderStatus, getUserOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getUserOrders);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus);

export default router;
