const productService = require('../services/product.service');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/ApiResponse');

const createProduct = catchAsync(async (req, res) => {
  const productData = { ...req.body };

  if (req.files && req.files.length > 0) {
    productData.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
  }

  const product = await productService.createProduct(productData);
  ApiResponse.created(res, product, 'Product created successfully');
});

const getProducts = catchAsync(async (req, res) => {
  const { products, pagination } = await productService.getProducts(req.query);
  ApiResponse.paginated(res, products, pagination);
});

const getProductById = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if (req.user) {
    const User = require('../models/User');
    await User.findById(req.user._id).then((u) => u?.addToRecentlyViewed(product._id));
  }

  ApiResponse.success(res, product);
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  ApiResponse.success(res, product);
});

const updateProduct = catchAsync(async (req, res) => {
  const updates = { ...req.body };

  if (req.files && req.files.length > 0) {
    updates.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
  }

  const product = await productService.updateProduct(req.params.id, updates);
  ApiResponse.success(res, product, 'Product updated successfully');
});

const deleteProduct = catchAsync(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  ApiResponse.success(res, null, 'Product deleted successfully');
});

const addReview = catchAsync(async (req, res) => {
  const product = await productService.addReview(
    req.params.id,
    req.user._id,
    req.user.name,
    req.body
  );
  ApiResponse.created(res, product, 'Review added successfully');
});

const deleteReview = catchAsync(async (req, res) => {
  const product = await productService.deleteReview(
    req.params.id,
    req.params.reviewId,
    req.user._id,
    req.user.role
  );
  ApiResponse.success(res, product, 'Review deleted successfully');
});

const getFeaturedProducts = catchAsync(async (_req, res) => {
  const products = await productService.getFeaturedProducts();
  ApiResponse.success(res, products);
});

const getCategories = catchAsync(async (_req, res) => {
  const categories = await productService.getCategories();
  ApiResponse.success(res, categories);
});

const getRelatedProducts = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  const related = await productService.getRelatedProducts(req.params.id, product.category);
  ApiResponse.success(res, related);
});

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  addReview,
  deleteReview,
  getFeaturedProducts,
  getCategories,
  getRelatedProducts,
};
