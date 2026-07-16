import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Heart, User, Sun, Moon, 
  Menu, X, ChevronDown, LogOut, FileText, Settings, Award 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/supabase';
import adityaLogo from '../assets/aditya-logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { getCartTotals } = useCart();
  const { darkMode, toggleTheme } = useTheme();
  const { itemCount } = getCartTotals();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState([]);

  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load products for auto-suggestion
    const loadProducts = async () => {
      try {
        const data = await api.products.list();
        setAllProducts(data);
      } catch (err) {
        console.error('Failed to load products for suggestions:', err);
      }
    };
    loadProducts();

    // Click outside handlers
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter suggestions
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, allProducts]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSuggestionClick = (slug) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/product/${slug}`);
  };

  const handleLogout = async () => {
    await logout();
    setShowUserDropdown(false);
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 glass-panel shadow-sm border-b dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center py-2">
              <img src={adityaLogo} alt="Aditya Enterprises" className="h-10 sm:h-14 w-auto object-contain drop-shadow-sm" />
            </Link>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search Adhesives, Sealants, Brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length > 1 && setShowSuggestions(true)}
                className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-900/70 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 transition-all text-slate-900 dark:text-white"
              />
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            </form>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-400">
                  SUGGESTED PRODUCTS
                </div>
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.slug)}
                    className="w-full flex items-center px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left border-b border-slate-100 dark:border-slate-800/30 last:border-b-0"
                  >
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-8 h-8 rounded object-cover mr-3 bg-slate-100 dark:bg-slate-850" 
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-950 dark:text-white truncate max-w-xs">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.brand?.name} · {item.category?.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Link to="/shop" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Catalog</Link>
            <Link to="/shop?tab=brands" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Brands</Link>
            <Link to="/#industries" className="hover:text-blue-600 dark:hover:text-cyan-400 transition">Industries</Link>
            <Link to="/#rfq" className="flex items-center text-blue-600 dark:text-cyan-400 hover:opacity-80">
              <FileText className="h-4 w-4 mr-1" />
              Request RFQ
            </Link>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 h-5 w-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      {user.full_name.charAt(0)}
                    </div>
                    <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {user.full_name.split(' ')[0]}
                    </span>
                    <ChevronDown className="h-3 w-3 text-slate-400" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 py-2">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.full_name}</p>
                        {user.role !== 'customer' && (
                          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800 uppercase">
                            {user.role}
                          </span>
                        )}
                      </div>

                      <Link 
                        to="/dashboard" 
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                      >
                        <User className="h-4 w-4 mr-2 text-slate-400" />
                        My Dashboard
                      </Link>

                      {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center px-4 py-2.5 text-sm text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-semibold transition"
                        >
                          <Settings className="h-4 w-4 mr-2 text-blue-500" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition border-t border-slate-100 dark:border-slate-800/80 mt-1"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Log out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center justify-center p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition sm:px-4 sm:py-2 sm:text-sm sm:font-bold sm:text-white sm:bg-blue-600 sm:hover:bg-blue-700 sm:shadow-md sm:shadow-blue-500/20"
                >
                  <User className="h-5 w-5 sm:hidden" />
                  <span className="hidden sm:inline">Log In</span>
                </Link>
              )}
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 dark:border-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-6 space-y-4">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 pl-9 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          </form>

          <div className="flex flex-col space-y-3 font-semibold text-slate-700 dark:text-slate-200">
            <Link to="/shop" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600 transition">Catalog</Link>
            <Link to="/shop?tab=brands" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600 transition">Brands</Link>
            <Link to="/#industries" onClick={() => setIsOpen(false)} className="py-2 hover:text-blue-600 transition">Industries</Link>
            <Link 
              to="/#rfq" 
              onClick={() => setIsOpen(false)} 
              className="py-2 flex items-center text-blue-600 dark:text-cyan-400"
            >
              <FileText className="h-4 w-4 mr-2" />
              Request RFQ
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
