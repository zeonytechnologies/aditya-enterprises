import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, ArrowRight, Building, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/supabase';
import { sendEmail } from '../services/mailer';

const STATES = [
  'Maharashtra', 'Delhi', 'Gujarat', 'Karnataka', 'Tamil Nadu', 
  'West Bengal', 'Telangana', 'Uttar Pradesh', 'Rajasthan', 'Haryana'
];

export default function Checkout() {
  const { cartItems, getCartTotals, clearCart, getProductUnitPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const totals = getCartTotals();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderPlaced]);

  // Form States
  const [shippingAddress, setShippingAddress] = useState({
    line1: user?.address_line1 || '',
    line2: user?.address_line2 || '',
    city: user?.city || '',
    state: user?.state || 'Maharashtra',
    postalCode: user?.postal_code || '',
  });

  const [companyDetails, setCompanyDetails] = useState({
    companyName: user?.company_name || '',
    gstNumber: user?.gst_number || '',
    email: user?.email || '',
    phone: user?.phone || '',
    deliveryNotes: ''
  });

  const [useBillingSame, setUseBillingSame] = useState(true);
  const [billingAddress, setBillingAddress] = useState({
    line1: '', line2: '', city: '', state: 'Maharashtra', postalCode: ''
  });

  const [gstError, setGstError] = useState('');
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  // Indian GST Validation Regex
  const validateGST = (gstin) => {
    if (!gstin) return true; // Optional for B2C
    const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return regex.test(gstin.toUpperCase());
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setFormError('');
    setGstError('');

    // Field checks
    if (!shippingAddress.line1 || !shippingAddress.city || !shippingAddress.postalCode) {
      setFormError('Please fill in all required shipping address fields.');
      return;
    }
    if (!companyDetails.phone || !companyDetails.email) {
      setFormError('Please enter contact phone and email.');
      return;
    }

    // GSTIN validation check
    if (companyDetails.gstNumber) {
      const isValid = validateGST(companyDetails.gstNumber);
      if (!isValid) {
        setGstError('Invalid GSTIN format. Standard Indian GSTIN is 15 characters (e.g. 27AAAAA1111A1Z1)');
        return;
      }
    }

    setLoading(true);
    try {
      const baseBilling = useBillingSame ? shippingAddress : billingAddress;
      const finalBilling = {
        ...baseBilling,
        phone: companyDetails.phone,
        email: companyDetails.email
      };
      
      const orderPayload = {
        user_id: user?.id || null,
        subtotal: parseFloat(totals.subtotal),
        discount: parseFloat(totals.discount),
        gst_amount: parseFloat(totals.gst),
        cgst: parseFloat(totals.cgst),
        sgst: parseFloat(totals.sgst),
        shipping: parseFloat(totals.shipping),
        grand_total: parseFloat(totals.grandTotal),
        company_name: companyDetails.companyName,
        gst_number: (companyDetails.gstNumber || '').toUpperCase(),
        billing_address: finalBilling,
        shipping_address: shippingAddress,
        delivery_notes: companyDetails.deliveryNotes,
        items: cartItems.map(item => {
          // Resolve correct pricing tier using helper
          const finalPrice = getProductUnitPrice(item.product, item.variant);
          return {
            product_id: item.product.id,
            variant_id: item.variant?.id || null,
            quantity: item.quantity,
            price: finalPrice,
            gst_percent: item.product.gst_percent,
            gst_amount: parseFloat(((finalPrice * item.quantity) * (item.product.gst_percent / 100)).toFixed(2)),
            total: parseFloat(((finalPrice * item.quantity) * (1 + item.product.gst_percent / 100)).toFixed(2))
          };
        })
      };

      const createdOrder = await api.orders.create(orderPayload);
      
      // Temporarily commented out email sending to avoid local 404 errors with Vercel serverless functions
      /*
      await sendEmail({
        to: user.email,
        subject: 'Order Confirmation - Aditya Enterprises',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px;">
            <h2 style="color: #0f172a;">Order Placed Successfully!</h2>
            <p style="color: #475569; font-size: 16px;">Hi ${user.name},</p>
            <p style="color: #475569; font-size: 16px;">We've received your order <strong>${createdOrder.display_id || createdOrder.id.substring(0,8)}</strong>.</p>
            <p style="color: #475569; font-size: 16px;">Total Amount: ₹${parseFloat(totals.grandTotal).toLocaleString('en-IN')}</p>
            <p style="color: #475569; font-size: 16px;">Please complete the payment in the next step to process your order.</p>
            <br />
            <p style="color: #475569; font-size: 14px;"><strong>Aditya Enterprises Team</strong></p>
          </div>
        `
      }).catch(err => console.error("Checkout email failed", err));
      */

      setOrderPlaced(true);
      clearCart();
      navigate(`/order-tracking?orderId=${createdOrder.id}`);
    } catch (err) {
      console.error(err);
      setFormError('Failed to create order: ' + (err.message || err.toString()));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      
      <div className="mb-8 flex items-center justify-between">
        <Link to="/cart" className="text-slate-400 hover:text-slate-700 flex items-center text-xs font-bold gap-1 transition">
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Cart
        </Link>
        <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-450 uppercase tracking-widest">
          <span>Cart</span>
          <span>→</span>
          <span className="text-blue-600 dark:text-cyan-400">Checkout Info</span>
          <span>→</span>
          <span>Payment Upload</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Shipping details forms */}
        <div className="lg:col-span-8 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* Box 1: Contact & Corporate Details */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold font-display border-b pb-3 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" /> Contact {user?.role === 'dealer' && '& Corporate'} Details
              </h2>

              {user?.role === 'dealer' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Aditya Enterprises"
                      value={companyDetails.companyName}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      value={companyDetails.gstNumber}
                      onChange={(e) => setCompanyDetails(prev => ({ ...prev, gstNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                    {gstError && <p className="text-[10px] text-red-500 font-bold leading-snug">{gstError}</p>}
                  </div>
                </div>
              )}

              <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${user?.role === 'dealer' ? 'border-t pt-4' : ''}`}>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={companyDetails.phone}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. purchase@aditya.com"
                    value={companyDetails.email}
                    onChange={(e) => setCompanyDetails(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Shipping Address */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
              <h2 className="text-lg font-bold font-display border-b pb-3">Shipping Logistics Address</h2>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="Factory floor, building number, block details"
                    value={shippingAddress.line1}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, line1: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Landmark, sub-area, sector detail"
                    value={shippingAddress.line2}
                    onChange={(e) => setShippingAddress(prev => ({ ...prev, line2: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State *</label>
                    <select
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    >
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="6 digits"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Box 3: Billing same toggle */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={useBillingSame}
                  onChange={(e) => setUseBillingSame(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span>Billing Address is same as Shipping Address</span>
              </label>

              {!useBillingSame && (
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-sm font-bold">Billing Address</h3>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Line 1 *</label>
                    <input
                      type="text"
                      required
                      value={billingAddress.line1}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, line1: e.target.value }))}
                      className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={billingAddress.city}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                    />
                    <select
                      value={billingAddress.state}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                    >
                      {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={billingAddress.postalCode}
                      onChange={(e) => setBillingAddress(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Box 4: Dispatch/delivery notes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Delivery Instructions / Logistics Notes</label>
              <textarea
                rows="3"
                placeholder="e.g. Ship using specific transport agent, deliver between 9 AM to 5 PM, or crane unloading support availability."
                value={companyDetails.deliveryNotes}
                onChange={(e) => setCompanyDetails(prev => ({ ...prev, deliveryNotes: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl border text-xs bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {formError && (
              <p className="text-xs text-red-500 font-bold border border-red-200 bg-red-50 p-3 rounded-xl">
                ⚠️ {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 text-sm"
            >
              {loading ? "Constructing Order..." : "Confirm & Proceed to Payment"}
              <ArrowRight className="h-4.5 w-4.5" />
            </button>

          </form>
        </div>

        {/* RIGHT: Order Summary widget */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-extrabold font-display border-b pb-3">Checkout Summary</h3>
            
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.variant ? `${item.product.id}-${item.variant.id}` : item.product.id} className="flex justify-between items-center text-xs gap-3">
                  <div className="flex-1 truncate">
                    <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
                      {item.product.name} {item.variant ? `(${item.variant.pack_size})` : ''}
                    </span>
                    <span className="text-[10px] text-slate-400">Qty: {item.quantity} · GST: {item.product.gst_percent}%</span>
                  </div>
                  <span className="font-extrabold text-slate-800 dark:text-white">
                    ₹{((getProductUnitPrice(item.product, item.variant) * item.quantity) * (1 + item.product.gst_percent / 100)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2.5 text-xs text-slate-500 font-semibold">
              <div className="flex justify-between">
                <span>Taxable Subtotal:</span>
                <span>₹{parseFloat(totals.subtotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax Value:</span>
                <span>₹{parseFloat(totals.gst).toLocaleString('en-IN')}</span>
              </div>
              {parseFloat(totals.discount) > 0 && (
                <div className="flex justify-between text-cyan-600 font-bold">
                  <span>Voucher Discount:</span>
                  <span>-₹{parseFloat(totals.discount).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{parseFloat(totals.shipping) === 0 ? "Free" : `₹${totals.shipping}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-3 border-t">
                <span>Grand Total:</span>
                <span>₹{parseFloat(totals.grandTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border p-3 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-blue-500 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
              <div className="text-[10px] leading-snug text-slate-500">
                <strong className="text-slate-800 dark:text-white font-bold block mb-0.5">Secure Transaction</strong>
                Your order is processed manually. We will hold items for 48 hours waiting for bank transfer UTR validation.
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
