import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  SlidersHorizontal, LayoutGrid, List, RotateCcw, 
  Search, ShieldCheck, ChevronDown, Check 
} from 'lucide-react';
import { api } from '../services/supabase';
import ProductCard from '../components/ProductCard';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialBrand = searchParams.get('brand') || '';
  const initialSearch = searchParams.get('search') || '';
  const initialIndustry = searchParams.get('industry') || '';
  const initialTab = searchParams.get('tab') || 'products';

  const [activeTab, setActiveTab] = useState(initialTab); // 'products' or 'brands'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [selectedIndustry, setSelectedIndustry] = useState(initialIndustry);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedGst, setSelectedGst] = useState('');
  const [sortBy, setSortBy] = useState('popularity');

  // Mobile filters toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // Sync tab from search parameters
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const loadCatalogData = async () => {
      setLoading(true);
      try {
        const prodData = await api.products.list();
        setProducts(prodData);
        
        const catData = await api.categories.list();
        setCategories(catData);
        
        const brandData = await api.brands.list();
        setBrands(brandData);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadCatalogData();
  }, []);

  // Sync state from query parameters on load
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || '');
    setSelectedBrand(searchParams.get('brand') || '');
    setSelectedIndustry(searchParams.get('industry') || '');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSelectedIndustry('');
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setSelectedGst('');
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand?.name.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter(p => p.category?.slug === selectedCategory || p.category_id === selectedCategory);
    }

    // Brand
    if (selectedBrand) {
      result = result.filter(p => p.brand?.slug === selectedBrand || p.brand_id === selectedBrand);
    }

    // Industry
    if (selectedIndustry) {
      result = result.filter(p => p.application?.toLowerCase().includes(selectedIndustry.toLowerCase()));
    }

    // GST Percent
    if (selectedGst) {
      result = result.filter(p => p.gst_percent === parseFloat(selectedGst));
    }

    // Stock Availability
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Price Range
    if (priceRange.min) {
      result = result.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= parseFloat(priceRange.max));
    }

    // Sort By
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      result.sort((a, b) => b.discount_percent - a.discount_percent);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      // Default: Popularity / Trending / Featured first
      result.sort((a, b) => (b.is_trending ? 1 : 0) - (a.is_trending ? 1 : 0));
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen font-sans bg-slate-50 dark:bg-slate-950">
      
      {/* Tab Switcher */}
      <div className="flex justify-center border-b border-slate-200 dark:border-slate-800 mb-10">
        <button
          onClick={() => { setActiveTab('products'); setSearchParams({ tab: 'products' }); }}
          className={`px-8 py-4 font-bold text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'products'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Product Catalog
        </button>
        <button
          onClick={() => { setActiveTab('brands'); setSearchParams({ tab: 'brands' }); }}
          className={`px-8 py-4 font-bold text-sm border-b-2 transition-all duration-300 ${
            activeTab === 'brands'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-650'
          }`}
        >
          Authorized Brands
        </button>
      </div>

      {activeTab === 'products' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm h-fit">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="h-4.5 w-4.5 text-blue-600 dark:text-cyan-400" /> Filters
              </span>
              <button 
                onClick={resetFilters}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Keyword Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Fevicol, VHB, 3M"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Brands */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand Partner</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs"
              >
                <option value="">All Brands</option>
                {brands.map(b => (
                  <option key={b.id} value={b.slug}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Price Ranges */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Price (₹)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="w-1/2 px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* GST Rate */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">GST Slab Rate</label>
              <div className="flex flex-col gap-1.5 text-xs text-slate-600 dark:text-slate-350">
                {['5', '12', '18', '28'].map(rate => (
                  <label key={rate} className="flex items-center gap-2 cursor-pointer hover:text-slate-950">
                    <input
                      type="radio"
                      name="gst"
                      value={rate}
                      checked={selectedGst === rate}
                      onChange={(e) => setSelectedGst(e.target.value)}
                      className="rounded border-slate-300 text-blue-600"
                    />
                    <span>{rate}% GST Products</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Stock Availability */}
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider pt-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-slate-300 text-blue-600"
              />
              <span>Only show in Stock</span>
            </label>

          </aside>

          {/* RIGHT: Product Feed Grid */}
          <div className="lg:col-span-9 space-y-6">
            
            {/* Header controls (Sort & Count) */}
            <div className="flex flex-wrap items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 px-6 py-4 rounded-2xl shadow-sm gap-4">
              <div className="text-sm font-semibold text-slate-500">
                Found <span className="text-slate-950 dark:text-white font-extrabold">{filteredProducts.length}</span> Products
              </div>

              {/* Sorting and Mobile toggles */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden px-4 py-2 text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-bold uppercase">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 border border-slate-250 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold text-slate-800 dark:text-white"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="newest">New Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="discount">Highest Discount</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Mobile Filters Drawer Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-950/60 backdrop-blur-sm">
                <div className="w-80 bg-white dark:bg-slate-900 h-full p-6 space-y-6 overflow-y-auto flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b pb-4">
                      <span className="text-base font-bold flex items-center gap-2">
                        <SlidersHorizontal className="h-4.5 w-4.5" /> Mobile Filters
                      </span>
                      <button 
                        onClick={() => setShowMobileFilters(false)}
                        className="p-1 rounded bg-slate-100 dark:bg-slate-800"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Filter fields duplicated inside mobile drawer */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Search</label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-slate-900"
                      >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Brand</label>
                      <select
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        className="w-full px-3 py-2 border rounded-xl text-xs bg-white dark:bg-slate-900"
                      >
                        <option value="">All Brands</option>
                        {brands.map(b => <option key={b.id} value={b.slug}>{b.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2 pt-6 border-t">
                    <button
                      onClick={resetFilters}
                      className="w-full py-2 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Grid display */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 w-full rounded-2xl skeleton" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-slate-900 border rounded-2xl space-y-4">
                <div className="text-4xl text-slate-350">🔍</div>
                <h3 className="text-xl font-bold text-slate-700 dark:text-white">No Products Found</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  We couldn't find any products matching your selected criteria. Try adjusting your query or filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Brands Grid Tab view */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {brands.map((b) => (
            <div
              key={b.id}
              onClick={() => {
                setSelectedBrand(b.slug);
                setActiveTab('products');
                setSearchParams({ tab: 'products', brand: b.slug });
              }}
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="h-16 w-32 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150/50 dark:border-slate-800 flex items-center justify-center p-2.5 overflow-hidden mx-auto mb-4">
                <img 
                  src={b.logo_url} 
                  alt={b.name} 
                  className="max-h-full max-w-full object-contain filter grayscale dark:invert contrast-125 group-hover:grayscale-0 duration-300" 
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white group-hover:text-blue-600 transition-colors">
                  {b.name}
                </h3>
                <p className="text-[11px] text-slate-550 leading-relaxed line-clamp-3">
                  {b.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t text-[10px] font-bold text-blue-600 dark:text-cyan-400 group-hover:underline text-center">
                Explore Catalog Products →
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
