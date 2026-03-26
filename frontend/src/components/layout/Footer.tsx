import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🏆</span>
              <span className="text-xl font-bold text-white">
                Sports<span className="text-orange-500">Shop</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              Your one-stop destination for all sports equipment. From cricket bats to fitness gear,
              we have everything you need to stay active.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm hover:text-orange-500 transition-colors">All Products</Link></li>
              <li><Link to="/products?category=cricket" className="text-sm hover:text-orange-500 transition-colors">Cricket</Link></li>
              <li><Link to="/products?category=football" className="text-sm hover:text-orange-500 transition-colors">Football</Link></li>
              <li><Link to="/products?category=fitness" className="text-sm hover:text-orange-500 transition-colors">Fitness</Link></li>
              <li><Link to="/products?category=indoor-games" className="text-sm hover:text-orange-500 transition-colors">Indoor Games</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="/orders" className="text-sm hover:text-orange-500 transition-colors">Track Order</Link></li>
              <li><Link to="/profile" className="text-sm hover:text-orange-500 transition-colors">My Account</Link></li>
              <li><Link to="/wishlist" className="text-sm hover:text-orange-500 transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="text-sm hover:text-orange-500 transition-colors">Shopping Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm">
                <MapPin size={16} className="text-orange-500 flex-shrink-0" />
                123 Sports Lane, Mumbai, India
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="text-orange-500 flex-shrink-0" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-orange-500 flex-shrink-0" />
                support@sportsshop.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} SportsShop. All rights reserved. Built with passion for sports.</p>
        </div>
      </div>
    </footer>
  );
}
