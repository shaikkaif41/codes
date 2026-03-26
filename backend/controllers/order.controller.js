const orderService = require('../services/order.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.user._id, req.body);
  ApiResponse.created(res, order, 'Order placed successfully');
});

const getMyOrders = catchAsync(async (req, res) => {
  const { orders, pagination } = await orderService.getOrders(req.user._id, req.query);
  ApiResponse.paginated(res, orders, pagination);
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id, req.user.role);
  ApiResponse.success(res, order);
});

const cancelOrder = catchAsync(async (req, res) => {
  const order = await orderService.cancelOrder(req.params.id, req.user._id);
  ApiResponse.success(res, order, 'Order cancelled successfully');
});

const getAllOrders = catchAsync(async (req, res) => {
  const { orders, pagination } = await orderService.getAllOrders(req.query);
  ApiResponse.paginated(res, orders, pagination);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  ApiResponse.success(res, order, 'Order status updated');
});

module.exports = { createOrder, getMyOrders, getOrderById, cancelOrder, getAllOrders, updateOrderStatus };
