const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

class AdminService {
  async getDashboardStats() {
    const [totalUsers, totalProducts, totalOrders, orderStats, revenueStats, lowStockProducts] =
      await Promise.all([
        User.countDocuments({ role: 'customer' }),
        Product.countDocuments(),
        Order.countDocuments(),
        Order.aggregate([
          {
            $group: {
              _id: '$orderStatus',
              count: { $sum: 1 },
            },
          },
        ]),
        Order.aggregate([
          { $match: { paymentStatus: 'paid' } },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: '$totalPrice' },
              averageOrderValue: { $avg: '$totalPrice' },
            },
          },
        ]),
        Product.find({ stock: { $lte: 10 } })
          .sort({ stock: 1 })
          .limit(10)
          .select('name stock category price'),
      ]);

    const orderStatusMap = {};
    orderStats.forEach((stat) => {
      orderStatusMap[stat._id] = stat.count;
    });

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      revenue: revenueStats[0]?.totalRevenue || 0,
      averageOrderValue: revenueStats[0]?.averageOrderValue || 0,
      ordersByStatus: orderStatusMap,
      lowStockProducts,
    };
  }

  async getSalesAnalytics(period = '30d') {
    let dateFilter;
    const now = new Date();

    switch (period) {
      case '7d':
        dateFilter = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        dateFilter = new Date(now.setDate(now.getDate() - 30));
        break;
      case '90d':
        dateFilter = new Date(now.setDate(now.getDate() - 90));
        break;
      case '1y':
        dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        dateFilter = new Date(now.setDate(now.getDate() - 30));
    }

    const [dailySales, categorySales, topProducts] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter }, paymentStatus: { $ne: 'failed' } } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: dateFilter } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productInfo',
          },
        },
        { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id: '$productInfo.category',
            revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
            unitsSold: { $sum: '$items.quantity' },
          },
        },
        { $sort: { revenue: -1 } },
      ]),
      Product.find()
        .sort({ soldCount: -1 })
        .limit(10)
        .select('name price soldCount category images'),
    ]);

    return { dailySales, categorySales, topProducts };
  }

  async getAllUsers(queryParams = {}) {
    const { page = 1, limit = 10, role, search } = queryParams;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await User.countDocuments(filter);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-wishlist -recentlyViewed');

    return {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalUsers: total,
      },
    };
  }

  async updateUserRole(userId, role) {
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
    if (!user) {
      const ApiError = require('../utils/ApiError');
      throw new ApiError(404, 'User not found');
    }
    return user;
  }
}

module.exports = new AdminService();
