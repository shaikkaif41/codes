const Product = require('../models/Product');
const ApiError = require('../utils/ApiError');

class ProductService {
  async createProduct(productData) {
    const product = await Product.create(productData);
    return product;
  }

  async getProducts(queryParams) {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      minPrice,
      maxPrice,
      sort = '-createdAt',
      brand,
      featured,
      inStock,
    } = queryParams;

    const filter = {};

    if (category) filter.category = category;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (featured === 'true') filter.featured = true;
    if (inStock === 'true') filter.stock = { $gt: 0 };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);

    let sortOption = {};
    switch (sort) {
      case 'price_asc': sortOption = { price: 1 }; break;
      case 'price_desc': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { averageRating: -1 }; break;
      case 'popular': sortOption = { soldCount: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-reviews');

    return {
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasMore: skip + products.length < total,
      },
    };
  }

  async getProductById(productId) {
    const product = await Product.findById(productId).populate('reviews.user', 'name avatar');
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async getProductBySlug(slug) {
    const product = await Product.findOne({ slug }).populate('reviews.user', 'name avatar');
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async updateProduct(productId, updates) {
    const product = await Product.findByIdAndUpdate(productId, updates, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async deleteProduct(productId) {
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    return product;
  }

  async addReview(productId, userId, userName, { rating, comment }) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const existingReview = product.reviews.find(
      (review) => review.user.toString() === userId.toString()
    );
    if (existingReview) {
      throw new ApiError(400, 'You have already reviewed this product');
    }

    product.reviews.push({ user: userId, name: userName, rating, comment });
    await product.calculateAverageRating();

    return product;
  }

  async deleteReview(productId, reviewId, userId, userRole) {
    const product = await Product.findById(productId);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    const review = product.reviews.id(reviewId);
    if (!review) {
      throw new ApiError(404, 'Review not found');
    }

    if (review.user.toString() !== userId.toString() && userRole !== 'admin') {
      throw new ApiError(403, 'Not authorized to delete this review');
    }

    product.reviews.pull(reviewId);
    await product.calculateAverageRating();

    return product;
  }

  async getFeaturedProducts() {
    return Product.find({ featured: true, stock: { $gt: 0 } })
      .sort({ averageRating: -1 })
      .limit(8)
      .select('-reviews');
  }

  async getCategories() {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    return categories.map((cat) => ({ name: cat._id, count: cat.count }));
  }

  async getRelatedProducts(productId, category) {
    return Product.find({
      _id: { $ne: productId },
      category,
      stock: { $gt: 0 },
    })
      .sort({ averageRating: -1 })
      .limit(4)
      .select('-reviews');
  }
}

module.exports = new ProductService();
