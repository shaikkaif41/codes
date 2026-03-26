const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

class CartService {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate(
      'items.product',
      'name price images stock slug'
    );
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], totalPrice: 0 });
    }
    return cart;
  }

  async addToCart(userId, productId, quantity = 1) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    if (product.stock < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      const newQty = existingItem.quantity + quantity;
      if (newQty > product.stock) {
        throw new ApiError(400, 'Insufficient stock for requested quantity');
      }
      existingItem.quantity = newQty;
      existingItem.price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    cart.calculateTotal();
    await cart.save();

    return cart.populate('items.product', 'name price images stock slug');
  }

  async updateCartItem(userId, productId, quantity) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      throw new ApiError(404, 'Item not found in cart');
    }

    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      throw new ApiError(400, 'Insufficient stock');
    }

    item.quantity = quantity;
    item.price = product.price;
    cart.calculateTotal();
    await cart.save();

    return cart.populate('items.product', 'name price images stock slug');
  }

  async removeFromCart(userId, productId) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      throw new ApiError(404, 'Cart not found');
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );
    cart.calculateTotal();
    await cart.save();

    return cart.populate('items.product', 'name price images stock slug');
  }

  async clearCart(userId) {
    const cart = await Cart.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      cart.totalPrice = 0;
      await cart.save();
    }
    return cart;
  }
}

module.exports = new CartService();
