import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { logout } from '../../store/slices/authSlice';
import { resetCart } from '../../store/slices/cartSlice';
import { resetWishlist } from '../../store/slices/wishlistSlice';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetCart());
    dispatch(resetWishlist());
    setIsProfileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🏆</span>
            <span className="text-xl font-bold text-gray-900">
              Sports<span className="text-orange-600">Shop</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for sports equipment..."
                className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600"
              >
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/products"
              className="text-gray-600 hover:text-orange-600 font-medium text-sm transition-colors"
            >
              Products
            </Link>

            {token && (
              <Link to="/wishlist" className="relative text-gray-600 hover:text-orange-600 transition-colors">
                <Heart size={22} />
              </Link>
            )}

            <Link to="/cart" className="relative text-gray-600 hover:text-orange-600 transition-colors">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            {token && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User size={16} className="text-orange-600" />
                  </div>
                  <span className="text-sm font-medium hidden lg:block">{user.name?.split(' ')[0]}</span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <User size={16} /> Profile
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                    >
                      <Package size={16} /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50"
                      >
                        <LayoutDashboard size={16} /> Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t">
            <form onSubmit={handleSearch} className="mt-3 mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                  <Search size={18} className="text-gray-400" />
                </button>
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">
                Products
              </Link>
              <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg flex items-center justify-between">
                Cart
                {cartCount > 0 && <span className="bg-orange-600 text-white text-xs px-2 py-0.5 rounded-full">{cartCount}</span>}
              </Link>
              {token && user ? (
                <>
                  <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">Wishlist</Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">Profile</Link>
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-lg">Admin Dashboard</Link>
                  )}
                  <button onClick={handleLogout} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 bg-orange-600 text-white rounded-lg text-center font-medium">Login</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
