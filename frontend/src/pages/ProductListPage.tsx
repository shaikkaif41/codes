import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '../components/product/ProductCard';
import { PageSpinner } from '../components/common/Spinner';
import { CATEGORIES, SORT_OPTIONS, getCategoryLabel } from '../utils/constants';

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const dispatch = useAppDispatch();
  const { products, pagination, loading } = useAppSelector((state) => state.products);

  const currentCategory = searchParams.get('category') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const loadProducts = useCallback(() => {
    const params: Record<string, string | number> = { page: currentPage, limit: 12 };
    if (currentCategory) params.category = currentCategory;
    if (currentSearch) params.search = currentSearch;
    if (currentSort) params.sort = currentSort;
    if (currentMinPrice) params.minPrice = currentMinPrice;
    if (currentMaxPrice) params.maxPrice = currentMaxPrice;
    dispatch(fetchProducts(params));
  }, [dispatch, currentCategory, currentSearch, currentSort, currentPage, currentMinPrice, currentMaxPrice]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const goToPage = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = currentCategory || currentSearch || currentMinPrice || currentMaxPrice;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {currentSearch
              ? `Search: "${currentSearch}"`
              : currentCategory
              ? getCategoryLabel(currentCategory)
              : 'All Products'}
          </h1>
          {pagination && (
            <p className="text-sm text-gray-500 mt-1">
              {pagination.totalProducts} products found
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <select
            value={currentSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center gap-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'fixed inset-0 z-40 bg-white p-6 overflow-auto' : 'hidden'} md:block md:static md:w-64 flex-shrink-0`}>
          <div className="flex items-center justify-between mb-4 md:hidden">
            <h2 className="font-bold text-lg">Filters</h2>
            <button onClick={() => setShowFilters(false)}><X size={24} /></button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="w-full mb-4 text-sm text-orange-600 hover:text-orange-700 font-medium"
            >
              Clear All Filters
            </button>
          )}

          {/* Categories */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => updateFilter('category', '')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  !currentCategory ? 'bg-orange-50 text-orange-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => { updateFilter('category', cat.value); setShowFilters(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                    currentCategory === cat.value
                      ? 'bg-orange-50 text-orange-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.icon}</span> {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={currentMinPrice}
                onChange={(e) => updateFilter('minPrice', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={currentMaxPrice}
                onChange={(e) => updateFilter('maxPrice', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <PageSpinner />
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 mb-4">No products found</p>
              <button
                onClick={clearFilters}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear filters and try again
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((page) => {
                      return page === 1 || page === pagination.totalPages || Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, idx, arr) => (
                      <span key={page}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-1">...</span>}
                        <button
                          onClick={() => goToPage(page)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            page === currentPage
                              ? 'bg-orange-600 text-white'
                              : 'border hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
