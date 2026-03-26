import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice';
import { PageSpinner } from '../components/common/Spinner';
import { formatCurrency } from '../utils/constants';
import toast from 'react-hot-toast';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useAppSelector((state) => state.cart);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchCart());
    }
  }, [dispatch, token]);

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }))
      .unwrap()
      .catch((err) => toast.error(err as string));
  };

  const handleRemove = (productId: string) => {
    dispatch(removeFromCart(productId))
      .unwrap()
      .then(() => toast.success('Item removed'))
      .catch((err) => toast.error(err as string));
  };

  if (!token) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Please login to view your cart</p>
        <Link to="/login" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
          Login
        </Link>
      </div>
    );
  }

  if (loading) return <PageSpinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven&apos;t added anything yet</p>
        <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
          Start Shopping
        </Link>
      </div>
    );
  }

  const shippingCost = totalPrice >= 999 ? 0 : 99;
  const tax = Math.round(totalPrice * 0.18);
  const grandTotal = totalPrice + shippingCost + tax;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart ({items.length} items)</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-xl border p-4 flex gap-4">
              <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                <img
                  src={item.product.images?.[0]?.url || 'https://images.unsplash.com/photo-1461896836934-bd45ba4c8e36?w=200'}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.product._id}`} className="font-semibold text-gray-900 hover:text-orange-600 line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(item.price)}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="p-2 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="text-red-500 hover:text-red-600 p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="font-bold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                {shippingCost === 0 ? 'FREE' : formatCurrency(shippingCost)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (18% GST)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </div>
          {shippingCost > 0 && (
            <p className="text-xs text-gray-500 mb-4">
              Add {formatCurrency(999 - totalPrice)} more for free shipping
            </p>
          )}
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            Proceed to Checkout <ArrowRight size={18} />
          </button>
          <Link
            to="/products"
            className="block text-center text-orange-600 hover:text-orange-700 mt-3 text-sm font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
