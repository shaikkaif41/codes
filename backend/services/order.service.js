const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

class OrderService {
  async createOrder(userId, orderData) {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    // Validate stock and build order items
    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id || item.product);
      if (!product) {
        throw new ApiError(400, `Product no longer available`);
      }
      if (product.stock < item.quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images.length > 0 ? product.images[0].url : '',
      });
    }

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal >= 999 ? 0 : 99;
    const tax = Math.round(subtotal * 0.18 * 100) / 100; // 18% GST
    const totalPrice = subtotal + shippingCost + tax;

    const order = await Order.create({
      user: userId,
      items: orderItems,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || 'cod',
      subtotal,
      shippingCost,
      tax,
      totalPrice,
      notes: orderData.notes,
    });

    // Update product stock and sold count
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, soldCount: item.quantity },
      });
    }

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return order;
  }

  async getOrders(userId, queryParams = {}) {
    const { page = 1, limit = 10, status } = queryParams;
    const filter = { user: userId };
    if (status) filter.orderStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
      },
    };
  }

  async getOrderById(orderId, userId, userRole) {
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    if (order.user._id.toString() !== userId.toString() && userRole !== 'admin') {
      throw new ApiError(403, 'Not authorized to view this order');
    }
    return order;
  }

  async updateOrderStatus(orderId, { orderStatus, paymentStatus }) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (orderStatus) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'delivered') {
        order.deliveredAt = new Date();
        order.paymentStatus = 'paid';
      }
      if (orderStatus === 'cancelled') {
        order.cancelledAt = new Date();
        // Restore stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity, soldCount: -item.quantity },
          });
        }
      }
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();
    return order;
  }

  async getAllOrders(queryParams = {}) {
    const { page = 1, limit = 10, status, paymentStatus } = queryParams;
    const filter = {};
    if (status) filter.orderStatus = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments(filter);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    return {
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalOrders: total,
      },
    };
  }

  async cancelOrder(orderId, userId) {
    const order = await Order.findById(orderId);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    if (order.user.toString() !== userId.toString()) {
      throw new ApiError(403, 'Not authorized');
    }
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      throw new ApiError(400, 'Order cannot be cancelled at this stage');
    }

    return this.updateOrderStatus(orderId, { orderStatus: 'cancelled' });
  }
}

module.exports = new OrderService();
