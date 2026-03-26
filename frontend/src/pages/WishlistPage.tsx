import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import ProductCard from '../components/product/ProductCard';
import { PageSpinner } from '../components/common/Spinner';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Wishlist ({items.length} items)</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save items you love for later</p>
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
