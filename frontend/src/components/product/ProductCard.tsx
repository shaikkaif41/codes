import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { addToCart } from '../../store/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../store/slices/wishlistSlice';
import StarRating from '../common/StarRating';
import { formatCurrency, getCategoryLabel } from '../../utils/constants';
import toast from 'react-hot-toast';
import type { Product } from '../../store/slices/productSlice';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to add items to cart');
      return;
    }
    dispatch(addToCart({ productId: product._id }))
      .unwrap()
      .then(() => toast.success('Added to cart'))
      .catch((err) => toast.error(err as string));
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Please login to use wishlist');
      return;
    }
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id))
        .unwrap()
        .then(() => toast.success('Removed from wishlist'));
    } else {
      dispatch(addToWishlist(product._id))
        .unwrap()
        .then(() => toast.success('Added to wishlist'));
    }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1461896836934-bd45ba4c8e36?w=400';

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleWishlistToggle}
            className={`p-2 rounded-full shadow-md transition-colors ${
              isInWishlist
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <Heart size={18} className={isInWishlist ? 'fill-current' : ''} />
          </button>
          {product.stock > 0 && (
            <button
              onClick={handleAddToCart}
              className="p-2 bg-white rounded-full shadow-md text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-orange-600 font-medium uppercase tracking-wide mb-1">
          {getCategoryLabel(product.category)}
        </p>
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        )}
        <div className="flex items-center gap-1 mb-2">
          <StarRating rating={product.averageRating} size={14} />
          <span className="text-xs text-gray-500">({product.numReviews})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
