const User = require('../models/User');
const ApiError = require('../utils/ApiError');

class WishlistService {
  async getWishlist(userId) {
    const user = await User.findById(userId).populate(
      'wishlist',
      'name price images slug stock averageRating category'
    );
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user.wishlist;
  }

  async addToWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    if (user.wishlist.includes(productId)) {
      throw new ApiError(400, 'Product already in wishlist');
    }

    user.wishlist.push(productId);
    await user.save();

    return user.populate(
      'wishlist',
      'name price images slug stock averageRating category'
    );
  }

  async removeFromWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await user.save();

    return user.populate(
      'wishlist',
      'name price images slug stock averageRating category'
    );
  }

  async isInWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    return user.wishlist.includes(productId);
  }
}

module.exports = new WishlistService();
