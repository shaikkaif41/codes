import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Heart, Minus, Plus, Star, ArrowLeft, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProductById, fetchRelatedProducts } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { productAPI } from '../services/api';
import ProductCard from '../components/product/ProductCard';
import StarRating from '../components/common/StarRating';
import { PageSpinner } from '../components/common/Spinner';
import { formatCurrency, getCategoryLabel } from '../utils/constants';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { product, related, loading } = useAppSelector((state) => state.products);
  const { token, user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  const isInWishlist = product ? wishlistItems.some((item) => item._id === product._id) : false;

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchRelatedProducts(id));
      setQuantity(1);
      setSelectedImage(0);
      window.scrollTo(0, 0);
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }
    if (product) {
      dispatch(addToCart({ productId: product._id, quantity }))
        .unwrap()
        .then(() => toast.success('Added to cart'))
        .catch((err) => toast.error(err as string));
    }
  };

  const handleWishlistToggle = () => {
    if (!token) {
      toast.error('Please login to use wishlist');
      return;
    }
    if (product) {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id)).then(() => toast.success('Removed from wishlist'));
      } else {
        dispatch(addToWishlist(product._id)).then(() => toast.success('Added to wishlist'));
      }
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !product) return;
    setSubmittingReview(true);
    try {
      await productAPI.addReview(product._id, reviewForm);
      toast.success('Review submitted');
      setReviewForm({ rating: 5, comment: '' });
      dispatch(fetchProductById(product._id));
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
    setSubmittingReview(false);
  };

  if (loading || !product) return <PageSpinner />;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const images = product.images?.length > 0
    ? product.images
    : [{ url: 'https://images.unsplash.com/photo-1461896836934-bd45ba4c8e36?w=800' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-orange-600">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-orange-600">Products</Link>
        <span>/</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-orange-600">
          {getCategoryLabel(product.category)}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate">{product.name}</span>
      </div>

      <Link to="/products" className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      {/* Product Details */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden mb-4">
            <img
              src={images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-orange-600' : 'border-transparent'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="text-sm text-orange-600 font-medium uppercase tracking-wide">
            {getCategoryLabel(product.category)}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-3">{product.name}</h1>
          {product.brand && <p className="text-gray-500 mb-3">Brand: {product.brand}</p>}

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={product.averageRating} size={20} />
            <span className="text-sm text-gray-500">
              ({product.numReviews} reviews)
            </span>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-xl text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
                <span className="bg-green-100 text-green-700 text-sm font-medium px-2 py-1 rounded">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <Package size={18} className={product.stock > 0 ? 'text-green-600' : 'text-red-600'} />
            {product.stock > 0 ? (
              <span className="text-sm text-green-600 font-medium">
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-3 hover:bg-gray-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 px-8 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg border transition-colors ${
                  isInWishlist
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <Heart size={20} className={isInWishlist ? 'fill-current' : ''} />
              </button>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

        {/* Review Form */}
        {token && user && (
          <form onSubmit={handleSubmitReview} className="bg-white p-6 rounded-xl border mb-8">
            <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <StarRating
                rating={reviewForm.rating}
                interactive
                onRate={(rating) => setReviewForm((prev) => ({ ...prev, rating }))}
                size={28}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
              <textarea
                value={reviewForm.comment}
                onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                required
                rows={3}
                maxLength={500}
                className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Share your experience..."
              />
            </div>
            <button
              type="submit"
              disabled={submittingReview}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {/* Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-xl border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="font-medium text-orange-600">{review.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{review.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{review.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
