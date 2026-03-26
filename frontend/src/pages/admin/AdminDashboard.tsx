import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Package, ShoppingCart, DollarSign, AlertTriangle,
  TrendingUp, BarChart3, Eye, ChevronDown,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { adminAPI, orderAPI, productAPI } from '../../services/api';
import { PageSpinner } from '../../components/common/Spinner';
import { formatCurrency, getStatusColor, getCategoryLabel } from '../../utils/constants';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<string, number>;
  lowStockProducts: { _id: string; name: string; stock: number; category: string; price: number }[];
}

interface Analytics {
  dailySales: { _id: string; revenue: number; orders: number }[];
  categorySales: { _id: string; revenue: number; unitsSold: number }[];
  topProducts: { _id: string; name: string; price: number; soldCount: number; category: string }[];
}

interface Order {
  _id: string;
  orderNumber: string;
  user: { name: string; email: string };
  totalPrice: number;
  orderStatus: string;
  createdAt: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#06b6d4', '#ec4899'];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'users'>('overview');
  const [period, setPeriod] = useState('30d');
  const [users, setUsers] = useState<{ _id: string; name: string; email: string; role: string; createdAt: string }[]>([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  useEffect(() => {
    loadDashboard();
  }, [period]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [statsRes, analyticsRes, ordersRes, productsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getAnalytics(period),
        orderAPI.getAllOrders({ limit: 10 }),
        productAPI.getProducts({ limit: 50 }),
      ]);
      setStats(statsRes.data.data);
      setAnalytics(analyticsRes.data.data);
      setRecentOrders(ordersRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    }
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const res = await adminAPI.getUsers({ limit: 50 });
      setUsers(res.data.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const loadFilteredOrders = async () => {
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (orderStatusFilter) params.status = orderStatusFilter;
      const res = await orderAPI.getAllOrders(params);
      setRecentOrders(res.data.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, orderStatus: string) => {
    try {
      await orderAPI.updateOrderStatus(orderId, { orderStatus });
      loadFilteredOrders();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) loadUsers();
    if (activeTab === 'orders') loadFilteredOrders();
  }, [activeTab, orderStatusFilter]);

  if (loading) return <PageSpinner />;
  if (!stats) return <div className="text-center py-20 text-gray-500">Failed to load dashboard</div>;

  const statCards = [
    { title: 'Total Revenue', value: formatCurrency(stats.revenue), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { title: 'Total Orders', value: stats.totalOrders.toString(), icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { title: 'Total Products', value: stats.totalProducts.toString(), icon: Package, color: 'bg-purple-50 text-purple-600' },
    { title: 'Total Customers', value: stats.totalUsers.toString(), icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(['overview', 'orders', 'products', 'users'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab ? 'bg-orange-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map((card) => (
              <div key={card.title} className="bg-white rounded-xl border p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{card.title}</span>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    <card.icon size={20} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            {analytics?.dailySales && analytics.dailySales.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-orange-600" /> Revenue Trend
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={analytics.dailySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Category Sales */}
            {analytics?.categorySales && analytics.categorySales.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-orange-600" /> Sales by Category
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={analytics.categorySales}
                      dataKey="revenue"
                      nameKey="_id"
                      cx="50%" cy="50%"
                      outerRadius={100}
                      label={({ _id, percent }) => `${getCategoryLabel(_id)} ${(percent * 100).toFixed(0)}%`}
                    >
                      {analytics.categorySales.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Orders by Day Bar Chart */}
          {analytics?.dailySales && analytics.dailySales.length > 0 && (
            <div className="bg-white rounded-xl border p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Orders per Day</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics.dailySales}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Low Stock & Top Products */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Low Stock Alerts */}
            {stats.lowStockProducts.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-red-500" /> Low Stock Alerts
                </h3>
                <div className="space-y-3">
                  {stats.lowStockProducts.map((product) => (
                    <div key={product._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{getCategoryLabel(product.category)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Products */}
            {analytics?.topProducts && analytics.topProducts.length > 0 && (
              <div className="bg-white rounded-xl border p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" /> Top Selling Products
                </h3>
                <div className="space-y-3">
                  {analytics.topProducts.slice(0, 5).map((product, idx) => (
                    <div key={product._id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-bold text-orange-600">
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.soldCount} sold</p>
                        </div>
                      </div>
                      <span className="font-medium text-sm">{formatCurrency(product.price)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Order Management</h3>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-1.5 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{order.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/orders/${order._id}`} className="text-orange-600 hover:text-orange-700">
                          <Eye size={16} />
                        </Link>
                        {order.orderStatus !== 'delivered' && order.orderStatus !== 'cancelled' && (
                          <div className="relative group">
                            <button className="text-gray-400 hover:text-gray-600">
                              <ChevronDown size={16} />
                            </button>
                            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border py-1 hidden group-hover:block z-10">
                              {['confirmed', 'processing', 'shipped', 'delivered'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleUpdateOrderStatus(order._id, status)}
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-gray-50 capitalize"
                                >
                                  Mark {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {recentOrders.length === 0 && (
            <p className="text-center py-8 text-gray-500">No orders found</p>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Product Inventory</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{getCategoryLabel(product.category)}</td>
                    <td className="px-4 py-3 text-sm font-medium">{formatCurrency(product.price)}</td>
                    <td className="px-4 py-3 text-sm">{product.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? 'bg-red-100 text-red-700'
                          : product.stock <= 10
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock === 0 ? 'Out of Stock' : product.stock <= 10 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border">
          <div className="p-4 border-b">
            <h3 className="font-semibold">User Management</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <p className="text-center py-8 text-gray-500">Loading users...</p>
          )}
        </div>
      )}
    </div>
  );
}
