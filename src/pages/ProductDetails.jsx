import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  FileText, ShieldCheck, Download, ShoppingCart, 
  Send, Phone, HelpCircle, Star, Heart, Check, Plus 
} from 'lucide-react';
import { api } from '../services/supabase';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import canvasConfetti from 'canvas-confetti';

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, getProductUnitPrice } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [view360, setView360] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // RFQ Modal State
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqQty, setRfqQty] = useState(100);
  const [rfqNote, setRfqNote] = useState('');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);

  // Bundle Recommendations State
  const [bundleProducts, setBundleProducts] = useState([]);
  const [checkedBundleItems, setCheckedBundleItems] = useState({});
  const [bundleTotal, setBundleTotal] = useState({ taxable: 0, gst: 0, grand: 0 });

  // Reviews & Q&A
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const loadProductDetails = async () => {
      setLoading(true);
      try {
        const data = await api.products.getBySlug(slug);
        if (!data) {
          navigate('/shop');
          return;
        }
        setProduct(data);
        setActiveImage(0);
        
        // Enforce MOQ based on role
        const isB2B = user && (user.role === 'dealer' || user.role === 'distributor');
        if (data.variants && data.variants.length > 0) {
          const sorted = [...data.variants].sort((a,b) => parseFloat(a.price) - parseFloat(b.price));
          setSelectedVariant(sorted[0]);
          setQuantity(isB2B ? (sorted[0].moq || 1) : 1);
          setRfqQty((sorted[0].moq || 1) * 10);
        } else {
          setSelectedVariant(null);
          setQuantity(isB2B ? (data.moq || 1) : 1);
          setRfqQty((data.moq || 1) * 10);
        }

        // Fetch related products for bundle matching
        const allProds = await api.products.list();
        const related = allProds
          .filter(p => p.id !== data.id && p.category_id === data.category_id)
          .slice(0, 2);
        setBundleProducts(related);

        // Set default bundles checked
        const defaultChecked = {};
        related.forEach(p => { defaultChecked[p.id] = true; });
        setCheckedBundleItems(defaultChecked);

        // Fetch reviews
        const revData = await api.reviews.list(data.id);
        setReviews(revData);

      } catch (err) {
        console.error('Failed to load product details:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProductDetails();
  }, [slug, user, navigate]);

  // Recalculate bundle pricing whenever checked items modify
  useEffect(() => {
    if (!product) return;
    
    let sub = getProductUnitPrice(product) * quantity;
    let gst = sub * ((product.gst_percent || 18) / 100);

    bundleProducts.forEach(p => {
      if (checkedBundleItems[p.id]) {
        const pPrice = getProductUnitPrice(p);
        sub += pPrice;
        gst += pPrice * ((p.gst_percent || 18) / 100);
      }
    });

    // Apply a 10% Bundle Discount
    const rawGrand = sub + gst;
    const discount = rawGrand * 0.10;
    const grand = rawGrand - discount;

    setBundleTotal({
      taxable: sub.toFixed(2),
      gst: gst.toFixed(2),
      discount: discount.toFixed(2),
      grand: grand.toFixed(2)
    });
  }, [checkedBundleItems, bundleProducts, product, quantity]);

  if (loading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-screen">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-[450px] skeleton rounded-3xl" />
          <div className="space-y-6">
            <div className="h-8 w-2/3 skeleton rounded-lg" />
            <div className="h-6 w-1/3 skeleton rounded-lg" />
            <div className="h-4 w-full skeleton rounded-lg" />
            <div className="h-24 w-full skeleton rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const unitPrice = getProductUnitPrice(product, selectedVariant);
  const showDiscount = selectedVariant ? selectedVariant.mrp > selectedVariant.price : product.discount_percent > 0;
  const isB2B = user && (user.role === 'dealer' || user.role === 'distributor');
  const minQty = isB2B ? ((selectedVariant || product).moq || 1) : 1;

  // 360° Drag Rotation Simulation handlers
  const handleMouseDown = (e) => {
    if (!view360) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !view360) return;
    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 15) {
      const step = deltaX > 0 ? 1 : -1;
      setSpinIndex(prev => (prev + step + 12) % 12); // 12 discrete angles
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAddToCart = () => {
    if (quantity < minQty) {
      alert(`Minimum order quantity for this item under your tier is ${minQty} unit(s).`);
      return;
    }
    addToCart(product, quantity, selectedVariant);
    
    // Confetti effect for instant feedback
    canvasConfetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  const handleAddBundleToCart = () => {
    addToCart(product, quantity, selectedVariant);
    bundleProducts.forEach(p => {
      if (checkedBundleItems[p.id]) {
        addToCart(p, 1);
      }
    });

    canvasConfetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.8 }
    });
  };

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.rfqs.submit({
        user_id: user?.id || null,
        company_name: user?.company_name || 'Individual Customer',
        gst_number: user?.gst_number || '',
        contact_email: user?.email || 'sales@aditya.com',
        contact_phone: user?.phone || '+91 9000000000',
        product_id: product.id,
        requirement: rfqNote || `RFQ generated for product: ${product.name}`,
        quantity: parseInt(rfqQty)
      });
      setRfqSubmitted(true);
      setTimeout(() => {
        setRfqSubmitted(false);
        setShowRfqModal(false);
        setRfqNote('');
      }, 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.reviews.submit({
        user_id: user.id,
        product_id: product.id,
        rating: newRating,
        comment: newComment
      });
      setReviewSubmitted(true);
      setNewComment('');
      // Reload reviews
      const updated = await api.reviews.list(product.id);
      setReviews(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* Product top row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
        
        {/* LEFT: Image Gallery & 360 viewer */}
        <div className="lg:col-span-6 space-y-4">
          
          <div className="relative aspect-square w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
            
            {view360 ? (
              <div 
                className="w-full h-full flex flex-col items-center justify-center p-10 cursor-grab active:cursor-grabbing select-none"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div className="text-center text-xs font-semibold text-slate-450 uppercase tracking-widest mb-4">
                  Drag horizontal to spin the barrel
                </div>
                <div className="relative w-72 h-72 flex items-center justify-center">
                  {/* Simulate rotation by changing the rotation transformation angle dynamically based on mouse drag */}
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    style={{ transform: `rotate(${spinIndex * 30}deg)` }}
                    className="max-h-full max-w-full object-contain pointer-events-none transition-transform duration-100"
                  />
                  <div className="absolute bottom-2 font-display text-[10px] bg-slate-100 dark:bg-slate-800 border px-3 py-1 rounded-full font-bold uppercase text-slate-500">
                    Angle: {spinIndex * 30}°
                  </div>
                </div>
              </div>
            ) : (
              <img 
                src={product.images[activeImage]} 
                alt={product.name}
                className="max-h-full max-w-full object-contain p-6"
              />
            )}

            {/* Toggle 360 View */}
            <button
              onClick={() => setView360(!view360)}
              className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-extrabold uppercase rounded-lg tracking-wider border border-slate-750 hover:bg-slate-850 transition"
            >
              {view360 ? "Standard View" : "360° Interactive"}
            </button>
          </div>

          {/* Thumbnail list */}
          {!view360 && (
            <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`h-20 w-20 bg-white dark:bg-slate-900 rounded-xl border p-2 overflow-hidden flex items-center justify-center ${
                    idx === activeImage ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'
                  }`}
                >
                  <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Product Buy Box / Details */}
        <div className="lg:col-span-6 space-y-6">
          <div className="border-b pb-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="text-blue-600 dark:text-cyan-400 tracking-wide uppercase">{product.brand?.name}</span>
              <span>SKU: {selectedVariant?.sku || product.sku}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight">{product.name}</h1>
            
            {/* Rating summary */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <span className="font-semibold text-slate-500">({reviews.length} Customer Reviews)</span>
            </div>
          </div>

          {/* Specifications Bullet list */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-xl">
              <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">HSN Code</span>
              <span className="font-extrabold text-slate-800 dark:text-white">{product.hsn_code}</span>
            </div>
            <div className="bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-xl">
              <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">Pack Size</span>
              <span className="font-extrabold text-slate-800 dark:text-white">{selectedVariant?.pack_size || product.pack_size}</span>
            </div>
            <div className="bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-xl">
              <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">Shelf Life</span>
              <span className="font-extrabold text-slate-800 dark:text-white">{product.shelf_life || 'N/A'}</span>
            </div>
            <div className="bg-slate-100/50 dark:bg-slate-900/50 p-3 rounded-xl">
              <span className="text-slate-400 block font-semibold uppercase text-[9px] mb-0.5">Weight</span>
              <span className="font-extrabold text-slate-800 dark:text-white">{selectedVariant?.weight || product.weight} Kg</span>
            </div>
          </div>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Select Package Size</span>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id || v.sku}
                    type="button"
                    onClick={() => {
                      setSelectedVariant(v);
                      // Enforce MOQ on select
                      setQuantity(isB2B ? (v.moq || 1) : 1);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedVariant?.sku === v.sku
                        ? 'border-blue-600 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-cyan-400 dark:border-cyan-400'
                        : 'border-slate-200 hover:border-slate-350 dark:border-slate-800'
                    }`}
                  >
                    {v.pack_size}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Pricing Box */}
          <div className="bg-slate-100/50 dark:bg-slate-900/50 p-5 rounded-2xl border dark:border-slate-800 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                <span>Basic Price</span>
                <span>₹{unitPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-slate-500">
                <span>GST ({product.gst_percent}%)</span>
                <span>+₹{(unitPrice * (product.gst_percent / 100)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between items-end">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Net Total (Per Unit)</span>
                <div className="text-right">
                  {showDiscount && (
                    <div className="text-xs text-slate-400 line-through mb-1">
                      MRP: ₹{parseFloat(selectedVariant ? selectedVariant.mrp : product.mrp).toLocaleString('en-IN')}
                    </div>
                  )}
                  <span className="text-3xl font-extrabold font-display text-blue-600 dark:text-cyan-400">
                    ₹{(unitPrice + (unitPrice * (product.gst_percent / 100))).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 font-semibold flex items-center gap-1.5">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Tax invoice provided. B2B buyers can claim GST ITC at checkout.</span>
            </div>

            {isB2B && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-350 border border-emerald-100 dark:border-emerald-900 text-xs font-bold rounded-xl flex justify-between">
                <span>Wholesale B2B Rate applied:</span>
                <span>MOQ: {selectedVariant ? selectedVariant.moq : product.moq} Units</span>
              </div>
            )}
          </div>

          {/* Buy Box selectors */}
          <div className="flex gap-4 items-center">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">QTY</span>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
                <button 
                  onClick={() => setQuantity(prev => Math.max(minQty, prev - 1))}
                  className="px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold"
                >
                  -
                </button>
                <span className="px-4 font-bold text-sm w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(prev => prev + 1)}
                  className="px-3.5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-850 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex-1 pt-5">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 text-sm"
              >
                <ShoppingCart className="h-4.5 w-4.5" /> Add to Cart
              </button>
            </div>
          </div>

          {/* B2B Call to Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t text-xs">
            <button
              onClick={() => setShowRfqModal(true)}
              className="py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-800 transition flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5 text-cyan-400" /> Request Bulk Quote
            </button>
            <a
              href={`https://wa.me/917483552250?text=Hi, I am interested in bulk procurement for ${encodeURIComponent(product.name)} (SKU: ${product.sku}). Please share details.`}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Phone className="h-3.5 w-3.5" /> WhatsApp Inquiry
            </a>
          </div>

        </div>
      </div>

      {/* Frequently Bought Together Bundle */}
      {bundleProducts.length > 0 && (
        <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mb-16">
          <h3 className="text-lg font-extrabold font-display mb-6">Frequently Bought Together (Save 10% Bundle)</h3>
          
          <div className="flex flex-col lg:flex-row items-center gap-8 justify-between">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 flex-1">
              
              {/* Product 1 */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border flex-grow min-w-[240px] max-w-full sm:max-w-xs">
                <img src={product.images[0]} alt="" className="w-14 h-14 object-contain" />
                <div>
                  <h4 className="text-xs font-bold line-clamp-1">{product.name}</h4>
                  <span className="text-xs font-extrabold">₹{unitPrice.toFixed(2)}</span>
                </div>
              </div>

              <Plus className="text-slate-350" />

              {/* Related Products list */}
              {bundleProducts.map(p => (
                <div key={p.id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border flex-grow min-w-[240px] max-w-full sm:max-w-xs relative">
                  <input
                    type="checkbox"
                    checked={checkedBundleItems[p.id] || false}
                    onChange={(e) => setCheckedBundleItems(prev => ({ ...prev, [p.id]: e.target.checked }))}
                    className="absolute top-2 left-2 rounded text-blue-600"
                  />
                  <img src={p.images[0]} alt="" className="w-14 h-14 object-contain ml-2" />
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1">{p.name}</h4>
                    <span className="text-xs font-extrabold">₹{getProductUnitPrice(p).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations and bundle submission */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800 pt-6 lg:pt-0 lg:pl-8 space-y-4 w-full lg:w-72">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>Items Subtotal:</span>
                  <span>₹{bundleTotal.taxable}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-semibold">
                  <span>GST Taxes:</span>
                  <span>₹{bundleTotal.gst}</span>
                </div>
                <div className="flex justify-between text-cyan-600 font-bold">
                  <span>Bundle Discount (10%):</span>
                  <span>-₹{bundleTotal.discount}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold pt-2 border-t">
                  <span>Bundle Total:</span>
                  <span>₹{bundleTotal.grand}</span>
                </div>
              </div>
              <button
                onClick={handleAddBundleToCart}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow"
              >
                Add Checked Bundle to Cart
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Details Sheets / Downloads / Specs Tab block */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        
        {/* Specs column */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border p-6 rounded-3xl space-y-6">
          <h3 className="text-lg font-bold font-display border-b pb-3">Technical Specifications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(product.specifications || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between border-b pb-2 text-xs">
                <span className="text-slate-400 font-semibold">{key}</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
              </div>
            ))}
            <div className="flex justify-between border-b pb-2 text-xs">
              <span className="text-slate-400 font-semibold">Preferred Application</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{product.application}</span>
            </div>
          </div>
          
          <div className="space-y-2.5 pt-4 text-xs leading-relaxed">
            <h4 className="font-bold text-slate-800 dark:text-slate-100">Functional Description</h4>
            <p className="text-slate-500">{product.technical_description || product.description}</p>
          </div>
        </div>

        {/* Technical documents column */}
        <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl space-y-6 h-fit">
          <h3 className="text-lg font-bold font-display border-b pb-3">Technical Documents</h3>
          <div className="space-y-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Downloading Technical Datasheet (TDS) PDF"); }}
              className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-slate-100 transition border text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-blue-500" /> Technical Datasheet (TDS)
              </span>
              <Download className="h-4 w-4 text-slate-400" />
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); alert("Downloading Material Safety Datasheet (MSDS) PDF"); }}
              className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl hover:bg-slate-100 transition border text-xs font-bold"
            >
              <span className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-red-500" /> Safety Datasheet (MSDS)
              </span>
              <Download className="h-4 w-4 text-slate-400" />
            </a>
          </div>
        </div>

      </section>

      {/* Review Tab section */}
      <section className="bg-white dark:bg-slate-900 border rounded-3xl p-6 md:p-8 space-y-8">
        <h3 className="text-lg font-bold font-display border-b pb-3">Product Reviews</h3>
        
        {/* Review list */}
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((rev) => (
              <div key={rev.id} className="border-b pb-4 last:border-b-0 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{rev.user?.full_name || 'Verified Buyer'}</span>
                  <span className="text-slate-400">{new Date(rev.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex text-amber-400 text-xs">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                </div>
                <p className="text-xs text-slate-650 dark:text-slate-400 italic">"{rev.comment}"</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic py-4">No reviews written for this product yet. Be the first!</div>
        )}

        {/* Submit Review */}
        {user ? (
          <form onSubmit={handleReviewSubmit} className="space-y-4 border-t pt-6">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Write a Review</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Rating:</span>
              <select
                value={newRating}
                onChange={(e) => setNewRating(parseInt(e.target.value))}
                className="px-3 py-1 border rounded bg-slate-50 dark:bg-slate-950 text-xs"
              >
                {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num} Stars</option>)}
              </select>
            </div>
            <textarea
              required
              rows="3"
              placeholder="Share your experience working with this adhesive/fitting standard..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl transition hover:bg-slate-800"
            >
              Submit Review
            </button>
          </form>
        ) : (
          <div className="text-xs text-slate-450 italic border-t pt-4">
            Please <Link to="/login" className="text-blue-600 hover:underline">Log in</Link> to write a review.
          </div>
        )}
      </section>

      {/* RFQ MODAL */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden border">
            <button 
              onClick={() => setShowRfqModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 font-bold"
            >
              ✕
            </button>

            {rfqSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="h-14 w-14 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">RFQ Received</h3>
                <p className="text-xs text-slate-400">We have registered your procurement inquiry. Quotes will update shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleRfqSubmit} className="space-y-4">
                <h3 className="text-xl font-extrabold font-display">Product Specific Bulk RFQ</h3>
                <p className="text-xs text-slate-500">Submit bulk inquiry coordinates specifically for: <strong className="text-slate-800 dark:text-white">{product.name}</strong></p>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Quantity Requested</label>
                  <input
                    type="number"
                    min={minQty}
                    value={rfqQty}
                    onChange={(e) => setRfqQty(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Special Instructions / Custom Packaging</label>
                  <textarea
                    rows="3"
                    value={rfqNote}
                    onChange={(e) => setRfqNote(e.target.value)}
                    placeholder="e.g. Need customized moisture barrier plastic sheet packing or urgent delivery scheduling."
                    className="w-full px-4 py-2.5 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Submit Procurement Quote Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
