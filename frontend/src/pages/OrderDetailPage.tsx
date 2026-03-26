import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchOrderById, cancelOrder } from '../store/slices/orderSlice';
import { PageSpinner } from '../components/common/Spinner';
import { formatCurrency, getStatusColor } from '../utils/constants';
import toast from 'react-hot-toast';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { order, loading } = useAppSelector((state) => state.orders);

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (!order || !confirm('Are you sure you want to cancel this order?')) return;
    try {
      await dispatch(cancelOrder(order._id)).unwrap();
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(err as string);
    }
  };

  if (loading || !order) return <PageSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/orders" className="inline-flex items-center gap-1 text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-orange-600" /> Shipping Address
          </h3>
          <p className="text-sm text-gray-600">
            {order.shippingAddress.street}<br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
            {order.shippingAddress.country}
            {order.shippingAddress.phone && <><br />Phone: {order.shippingAddress.phone}</>}
          </p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <CreditCard size={18} className="text-orange-600" /> Payment
          </h3>
          <p className="text-sm text-gray-600 capitalize">
            Method: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}<br />
            Status: <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Package size={18} className="text-orange-600" /> Summary
          </h3>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>{order.shippingCost === 0 ? 'FREE' : formatCurrency(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <hr className="my-1" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-xl border p-6 mb-6">
        <h2 className="font-bold text-lg mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 py-3 border-b last:border-0">
              {item.image && (
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <p className="font-bold">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Cancel button */}
      {['pending', 'confirmed'].includes(order.orderStatus) && (
        <div className="text-center">
          <button
            onClick={handleCancel}
            className="bg-red-50 text-red-600 hover:bg-red-100 px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
