import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchMyOrders } from '../store/slices/orderSlice';
import { PageSpinner } from '../components/common/Spinner';
import { formatCurrency, getStatusColor } from '../utils/constants';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders(undefined));
  }, [dispatch]);

  if (loading) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
          <Link to="/products" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border p-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </span>
                  <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-1 text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    <Eye size={16} /> View
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-4">
                {order.items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-500 self-center">+{order.items.length - 3} more</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-3 border-t">
                <span className="text-sm text-gray-500">{order.items.length} items</span>
                <span className="font-bold text-gray-900">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
