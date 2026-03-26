const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middleware/auth');
const { productValidator, reviewValidator } = require('../validators/product.validator');
const validate = require('../middleware/validate');
const { upload } = require('../config/cloudinary');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.get('/:id/related', getRelatedProducts);

router.post('/', protect, authorize('admin'), upload.array('images', 5), productValidator, validate, createProduct);
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

router.post('/:id/reviews', protect, reviewValidator, validate, addReview);
router.delete('/:id/reviews/:reviewId', protect, deleteReview);

module.exports = router;
