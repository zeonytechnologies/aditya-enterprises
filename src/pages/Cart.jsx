import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    getProductUnitPrice, 
    getCartTotals, 
    applyCoupon, 
    removeCoupon, 
    appliedCoupon 
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const totals = getCartTotals();
  const isB2B = user && (user.role === 'dealer' || user.role === 'distributor');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) return;

    const result = applyCoupon(couponCode.trim());
    if (result.success) {
      setCouponSuccess(result.message);
      setCouponCode('');
    } else {
      setCouponError(result.message);
    }
  };

  const handleCheckoutRedirect = () => {
    if (!user) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center space-y-6 font-sans">
        <div className="h-20 w-20 bg-blue-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-cyan-400">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-slate-555 max-w-sm mx-auto">
          Need high-strength wood glues, architectural hardware fittings or industrial sealants? Explore our catalog.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow"
        >
          Explore Catalog <ArrowRight className="h-4.5 w-4.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      <h1 className="text-3xl font-extrabold font-display mb-10">Shopping Cart & Tax Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Item list table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            {cartItems.map((item) => {
              const product = item.product;
              const unitPrice = getProductUnitPrice(product, item.variant);
              const totalTaxable = unitPrice * item.quantity;
              const gstAmount = totalTaxable * ((product.gst_percent || 18) / 100);
              const minQty = isB2B ? ((item.variant || product).moq || 1) : 1;

              return (
                <div 
                  key={item.variant ? `${product.id}-${item.variant.id}` : product.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-6 last:border-b-0 last:pb-0 gap-4"
                >
                  {/* Thumbnail & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-xl object-cover bg-slate-50 border p-1" 
                    />
                    <div>
                      <h3 className="text-sm font-bold leading-snug line-clamp-2 max-w-xs">
                        {product.name} {item.variant ? `(${item.variant.pack_size})` : ''}
                      </h3>
                      <div className="text-[10px] text-slate-400 font-semibold mt-1">
                        Brand: {product.brand?.name} · SKU: {item.variant?.sku || product.sku}
                      </div>
                      
                      {isB2B && (
                        <div className="mt-1 inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450 border border-emerald-150">
                          Dealer Pricing MOQ: {minQty} Applied
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-xl bg-slate-50 dark:bg-slate-950">
                      <button
                        onClick={() => updateQuantity(product.id, Math.max(minQty, item.quantity - 1), item.variant?.id)}
                        className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="px-3 font-bold text-xs w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, item.quantity + 1, item.variant?.id)}
                        className="px-2.5 py-1.5 hover:bg-slate-100 font-bold text-xs"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id, item.variant?.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>

                  {/* Tax breakdowns and totals */}
                  <div className="text-right sm:w-36 space-y-1">
                    <div className="text-xs font-semibold text-slate-400">
                      ₹{unitPrice.toFixed(2)}/unit
                    </div>
                    <div className="text-sm font-extrabold font-display">
                      ₹{(totalTaxable + gstAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-[9px] text-slate-400 font-semibold leading-none">
                      (Taxable: ₹{totalTaxable.toFixed(2)} + GST: ₹{gstAmount.toFixed(2)})
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Totals Summary panel */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Coupon apply box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-blue-600 dark:text-cyan-400" /> Apply Coupon
            </h4>
            
            {appliedCoupon ? (
              <div className="p-3 bg-blue-50 dark:bg-slate-950 text-blue-800 dark:text-cyan-400 rounded-xl flex items-center justify-between text-xs font-bold border">
                <span>Code Applied: {appliedCoupon.code} (-₹{parseFloat(totals.discount).toFixed(2)})</span>
                <button onClick={removeCoupon} className="p-1 hover:bg-blue-100 rounded">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleCouponSubmit} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. IND10"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border rounded-xl text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                >
                  Apply
                </button>
              </form>
            )}

            {couponError && <p className="text-[10px] text-red-500 font-bold leading-snug">{couponError}</p>}
            {couponSuccess && <p className="text-[10px] text-green-500 font-bold leading-snug">{couponSuccess}</p>}
          </div>

          {/* Checkout pricing box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold font-display border-b pb-3">Bill Estimation</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Taxable Amount (Subtotal):</span>
                <span className="font-bold text-slate-800 dark:text-white">₹{parseFloat(totals.subtotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-cyan-600 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-₹{parseFloat(totals.discount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {/* GST splits */}
              <div className="border-t border-dashed py-3 space-y-2 text-slate-500 font-semibold">
                <div className="flex justify-between text-[11px]">
                  <span>CGST (Central Tax Share):</span>
                  <span>₹{parseFloat(totals.cgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span>SGST (State Tax Share):</span>
                  <span>₹{parseFloat(totals.sgst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-850 dark:text-slate-200">
                  <span>Combined GST Total:</span>
                  <span>₹{parseFloat(totals.gst).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex justify-between text-slate-500 font-semibold">
                <span>Shipping Charges:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {parseFloat(totals.shipping) === 0 ? (
                    <span className="text-green-500 font-bold uppercase text-[10px]">Free Delivery</span>
                  ) : (
                    `₹${parseFloat(totals.shipping).toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold pt-4 border-t text-slate-950 dark:text-white">
                <span>Grand Total:</span>
                <span>₹{parseFloat(totals.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* B2B compliance reminder */}
            <div className="bg-slate-50 dark:bg-slate-950 border p-3.5 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-blue-500 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
              <div className="text-[10px] leading-snug text-slate-500">
                <strong className="text-slate-800 dark:text-white font-bold block mb-0.5">GST Credit Available</strong>
                Claim Input Tax Credit by providing your verified company name and GST identification number in the next step.
              </div>
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 text-sm"
            >
              Proceed to Checkout <ArrowRight className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
