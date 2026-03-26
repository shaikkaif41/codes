import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchFeatured, fetchCategories } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { PageSpinner } from '../components/common/Spinner';
import { CATEGORIES } from '../utils/constants';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { featured, categories, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchCategories());
  }, [dispatch]);

  if (loading && featured.length === 0) return <PageSpinner />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-orange-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-orange-600 text-sm font-medium px-3 py-1 rounded-full mb-4">
              Premium Sports Equipment
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Gear Up For
              <br />
              <span className="text-orange-500">Your Game</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-lg">
              Discover the finest sports equipment for cricket, football, fitness, and more.
              From local sports to international gear — everything under one roof.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors flex items-center gap-2"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link
                to="/products?featured=true"
                className="border-2 border-white/30 hover:border-white text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Featured Products
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1461896836934-bd45ba4c8e36?w=1200')] bg-cover bg-center opacity-10" />
      </section>

      {/* Features */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders above ₹999' },
              { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
              { icon: Headphones, title: '24/7 Support', desc: 'Dedicated support' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '7-day return policy' },
            ].map((feature) => (
              <div key={feature.title} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon size={22} className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-900">{feature.title}</h3>
                  <p className="text-xs text-gray-500">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-gray-600">Find the perfect gear for your favorite sport</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {CATEGORIES.slice(0, 12).map((cat) => {
            const catData = categories.find((c) => c.name === cat.value);
            return (
              <Link
                key={cat.value}
                to={`/products?category=${cat.value}`}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-orange-200 group"
              >
                <span className="text-3xl block mb-2 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </span>
                <h3 className="font-medium text-sm text-gray-800">{cat.label}</h3>
                {catData && (
                  <p className="text-xs text-gray-500 mt-1">{catData.count} items</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
                <p className="text-gray-600">Hand-picked products just for you</p>
              </div>
              <Link
                to="/products?featured=true"
                className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
              >
                View All <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Elevate Your Game?
          </h2>
          <p className="text-lg text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who trust SportsShop for their equipment needs.
            Get exclusive deals and the latest arrivals delivered to your doorstep.
          </p>
          <Link
            to="/products"
            className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold transition-colors inline-flex items-center gap-2"
          >
            Explore Collection <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
