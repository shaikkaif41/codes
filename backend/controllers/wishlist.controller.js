const wishlistService = require('../services/wishlist.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const getWishlist = catchAsync(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  ApiResponse.success(res, wishlist);
});

const addToWishlist = catchAsync(async (req, res) => {
  const user = await wishlistService.addToWishlist(req.user._id, req.params.productId);
  ApiResponse.success(res, user.wishlist, 'Added to wishlist');
});

const removeFromWishlist = catchAsync(async (req, res) => {
  const user = await wishlistService.removeFromWishlist(req.user._id, req.params.productId);
  ApiResponse.success(res, user.wishlist, 'Removed from wishlist');
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
