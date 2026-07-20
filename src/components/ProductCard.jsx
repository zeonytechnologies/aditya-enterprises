import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Percent, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductCard({ product }) {
  const { addToCart, getProductUnitPrice } = useCart();
  const { user } = useAuth();
  
  const unitPrice = getProductUnitPrice(product);
  const showDiscount = product.discount_percent > 0;
  const isB2B = user && (user.role === 'dealer' || user.role === 'distributor');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <Link 
      to={`/product/${product.slug}`}
      className="group relative flex flex-col w-full rounded-xl sm:rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1 items-start">
        {product.is_featured && (
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider bg-blue-600 rounded shadow-sm">
            Featured
          </span>
        )}
        {product.is_flash_sale && (
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold text-white uppercase tracking-wider bg-red-500 rounded shadow-sm flex items-center">
            <Percent className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" /> {product.discount_percent > 0 ? `${product.discount_percent}% OFF` : 'DEAL'}
          </span>
        )}
        {isB2B && (
          <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-155 rounded">
            B2B Rate
          </span>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-50 dark:bg-slate-950 overflow-hidden img-zoom-container flex items-center justify-center">
        <img 
          src={product.images[0] || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80'} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          loading="lazy"
        />
        
        {/* Hover overlay quick add (Desktop only) */}
        <div className="hidden md:flex absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end justify-center p-4">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2.5 bg-white/95 dark:bg-slate-900/95 text-slate-950 dark:text-white text-xs font-bold rounded-xl shadow-lg hover:bg-blue-600 hover:text-white dark:hover:bg-cyan-400 dark:hover:text-slate-950 transition-all flex items-center justify-center gap-1.5"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Quick Add
          </button>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-col flex-1 p-3 sm:p-5">
        
        {/* Brand and SKU */}
        <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-450 dark:text-slate-500 font-semibold mb-1">
          <span className="truncate max-w-[70px] sm:max-w-none">{product.brand?.name || 'GENUINE'}</span>
          <span className="truncate max-w-[70px] sm:max-w-none">SKU: {product.sku}</span>
        </div>

        {/* Product Name */}
        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-2 min-h-[32px] sm:min-h-[40px] group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors mb-1.5 sm:mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2.5 sm:mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
            ))}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-400 font-medium">(4.8)</span>
        </div>

        {/* Price Tag & Tax Info */}
        <div className="mt-auto pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
          
          <div className="flex flex-col gap-0.5">
            <div className="flex justify-between items-center text-[10px] sm:text-xs">
              <span className="text-slate-500">Base Price</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                ₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between items-center text-[10px] sm:text-xs">
              <span className="text-slate-500">GST ({product.gst_percent}%)</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                +₹{(unitPrice * (product.gst_percent / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
          
          <div className="flex items-end justify-between border-t border-dashed border-slate-200 dark:border-slate-700 pt-1.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-medium">Final Price</span>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-sm sm:text-lg font-extrabold font-display text-slate-900 dark:text-white">
                  ₹{(unitPrice * (1 + product.gst_percent / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                {showDiscount && isB2B && (
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                    ₹{product.mrp.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>
            
            {/* Quick add mobile */}
            <button 
              onClick={handleQuickAdd}
              className="md:hidden p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
          
          {showDiscount && isB2B && (
            <p className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
              You save ₹{(product.mrp - (unitPrice * (1 + product.gst_percent / 100))).toLocaleString('en-IN', { maximumFractionDigits: 0 })}!
            </p>
          )}
          {!isB2B && (
            <p className="text-[9px] sm:text-[10px] text-slate-500 font-medium">
              MRP: ₹{product.mrp.toLocaleString('en-IN')} (Incl. of all taxes)
            </p>
          )}

        </div>
      </div>
    </Link>
  );
}
