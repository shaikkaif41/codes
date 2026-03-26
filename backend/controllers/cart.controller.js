const cartService = require('../services/cart.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const getCart = catchAsync(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  ApiResponse.success(res, cart);
});

const addToCart = catchAsync(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user._id, productId, quantity);
  ApiResponse.success(res, cart, 'Item added to cart');
});

const updateCartItem = catchAsync(async (req, res) => {
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, req.params.productId, quantity);
  ApiResponse.success(res, cart, 'Cart updated');
});

const removeFromCart = catchAsync(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
  ApiResponse.success(res, cart, 'Item removed from cart');
});

const clearCart = catchAsync(async (req, res) => {
  const cart = await cartService.clearCart(req.user._id);
  ApiResponse.success(res, cart, 'Cart cleared');
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
