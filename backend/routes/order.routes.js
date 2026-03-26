const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus } = require('../controllers/order.controller');
const { protect, authorize } = require('../middleware/auth');
const { orderValidator, updateOrderStatusValidator } = require('../validators/order.validator');
const validate = require('../middleware/validate');

router.use(protect);

router.post('/', orderValidator, validate, createOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);

// Admin routes
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatusValidator, validate, updateOrderStatus);

module.exports = router;
