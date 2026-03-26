import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: Record<string, unknown>) => api.put('/auth/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/auth/change-password', data),
};

export const productAPI = {
  getProducts: (params?: Record<string, string | number>) =>
    api.get('/products', { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  getProductBySlug: (slug: string) => api.get(`/products/slug/${slug}`),
  getFeatured: () => api.get('/products/featured'),
  getCategories: () => api.get('/products/categories'),
  getRelated: (id: string) => api.get(`/products/${id}/related`),
  createProduct: (data: FormData) =>
    api.post('/products', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updateProduct: (id: string, data: FormData) =>
    api.put(`/products/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  addReview: (id: string, data: { rating: number; comment: string }) =>
    api.post(`/products/${id}/reviews`, data),
  deleteReview: (productId: string, reviewId: string) =>
    api.delete(`/products/${productId}/reviews/${reviewId}`),
};

export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (productId: string, quantity: number = 1) =>
    api.post('/cart', { productId, quantity }),
  updateCartItem: (productId: string, quantity: number) =>
    api.put(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId: string) => api.delete(`/cart/${productId}`),
  clearCart: () => api.delete('/cart'),
};

export const orderAPI = {
  createOrder: (data: {
    shippingAddress: Record<string, string>;
    paymentMethod?: string;
    notes?: string;
  }) => api.post('/orders', data),
  getMyOrders: (params?: Record<string, string | number>) =>
    api.get('/orders/my-orders', { params }),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  cancelOrder: (id: string) => api.put(`/orders/${id}/cancel`),
  getAllOrders: (params?: Record<string, string | number>) =>
    api.get('/orders', { params }),
  updateOrderStatus: (id: string, data: { orderStatus?: string; paymentStatus?: string }) =>
    api.put(`/orders/${id}/status`, data),
};

export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId: string) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId: string) => api.delete(`/wishlist/${productId}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: (period?: string) =>
    api.get('/admin/analytics', { params: { period } }),
  getUsers: (params?: Record<string, string | number>) =>
    api.get('/admin/users', { params }),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
};

export default api;
