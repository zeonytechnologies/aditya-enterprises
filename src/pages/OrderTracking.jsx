import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircle, Clock, Truck, ShieldCheck, 
  Download, Printer, AlertTriangle, ArrowLeft 
} from 'lucide-react';
import { api } from '../services/supabase';

const TIMELINE_STEPS = [
  'Order Placed',
  'Payment Pending',
  'Payment Verified',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export default function OrderTracking() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const ord = await api.orders.getById(orderId);
        setOrder(ord);

        // Fetch corresponding payment status
        const payList = await api.payments.list();
        const pay = payList.find(p => p.order_id === orderId);
        setPayment(pay);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [orderId]);

  const getStepIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return TIMELINE_STEPS.indexOf(status);
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen skeleton rounded-3xl" />
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-bold">Order Not Found</h2>
        <Link to="/shop" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white print:bg-white print:text-black">
      
      {/* Hide on Print */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <Link to="/user" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition font-bold text-sm">
            <ArrowLeft className="h-4.5 w-4.5" /> Back to Dashboard
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const itemsList = order.items?.map(item => `- ${item.product?.name || 'Item'} x ${item.quantity}`).join('%0A') || '';
                const message = `Hello Aditya Enterprises,%0A%0AI am reaching out regarding my order.%0A%0A*Order ID:* ${order?.display_id || order?.id.substring(0,8)}%0A*Proforma Invoice:* ${order?.invoice_id || order?.id.substring(0,8)}%0A%0A*Items Purchased:*%0A${itemsList}%0A%0A*Total Amount:* ₹${order?.grand_total.toLocaleString('en-IN')}%0A%0APlease check the status of my order. Thank you!`;
                window.open(`https://wa.me/919342248827?text=${message}`, '_blank');
              }}
              className="px-4 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              Send to WhatsApp
            </button>
            <button
              onClick={handlePrintInvoice}
              className="px-4 py-2 bg-white dark:bg-slate-900 hover:bg-slate-100 border text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="h-4 w-4" /> Print GST Invoice
            </button>
          </div>
        </div>

      {/* order cancelled message */}
      {order.status === 'Cancelled' && (
        <div className="print:hidden bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl mb-8 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <div className="text-xs font-bold">
            This order has been Cancelled. Payment reference verification was rejected or timed out. Please contact support.
          </div>
        </div>
      )}

      {/* 1. Visual Tracking Timeline - Hide on Print */}
      <div className="print:hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm mb-10 overflow-x-auto">
        <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400 mb-8">Shipment Transit Timeline</h3>
        
        <div className="flex items-center min-w-[700px] justify-between relative">
          
          {/* Progress bar background line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-150 dark:bg-slate-800 z-0" />
          
          {/* Dynamic Progress fill line */}
          {currentStepIdx >= 0 && (
            <div 
              className="absolute top-4 left-6 h-0.5 bg-blue-600 dark:bg-cyan-400 z-0 transition-all duration-500"
              style={{ width: `${(currentStepIdx / (TIMELINE_STEPS.length - 1)) * 95}%` }}
            />
          )}

          {TIMELINE_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isActive = idx === currentStepIdx;
            const isPending = idx > currentStepIdx;

            return (
              <div key={step} className="flex flex-col items-center z-10 w-24">
                <div 
                  className={`h-9 w-9 rounded-full flex items-center justify-center border font-bold text-xs shadow-sm transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-blue-600 border-blue-600 text-white dark:bg-cyan-400 dark:border-cyan-400 dark:text-slate-950'
                      : isActive
                      ? 'bg-white border-blue-600 text-blue-600 ring-4 ring-blue-50 dark:bg-slate-900 dark:border-cyan-400 dark:text-cyan-400 dark:ring-cyan-950/20 scale-110'
                      : 'bg-white border-slate-200 text-slate-400 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle className="h-4 w-4" /> : idx + 1}
                </div>
                <span 
                  className={`text-[10px] font-bold text-center mt-3 leading-snug tracking-tight ${
                    isActive ? 'text-blue-600 dark:text-cyan-400 font-black' : isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-450'
                  }`}
                >
                  {step}
                </span>
              </div>
            );
          })}

        </div>
      </div>

      {/* 2. PRINTABLE B2B GST PROFORMA INVOICE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 md:p-12 shadow-sm font-sans text-slate-800 dark:text-slate-250 print:border-none print:shadow-none print:p-0 print:text-black">
        
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start border-b pb-8 gap-6">
          <div className="space-y-1.5">
            <h2 className="text-xl font-extrabold tracking-wide text-slate-950 dark:text-white font-display uppercase print:text-black">
              PROFORMA INVOICE
            </h2>
            <p className="text-xs text-slate-450 font-semibold uppercase tracking-wider">Original for Recipient</p>
            <div className="text-xs space-y-0.5 pt-2">
              <div>Invoice No: <strong className="text-slate-850 dark:text-white">{order.invoice_id || order.display_id || order.id.substring(0,8)}</strong></div>
              <div>Date: <strong className="text-slate-850 dark:text-white">{new Date(order.created_at).toLocaleDateString('en-IN')}</strong></div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 text-xs">
            <h3 className="text-base font-extrabold text-slate-950 dark:text-white print:text-black">ADITYA ENTERPRISES</h3>
            <p className="text-slate-500">3/1, S p road cross, near paan beeda shop HKK Lane,</p>
            <p className="text-slate-500">Medarpet, Kumbarpet, Hakkim khallel khan lane,</p>
            <p className="text-slate-500">Nagarathpete, Bengaluru, Karnataka 560002</p>
            <p className="font-bold text-slate-700 dark:text-slate-350">GSTIN: 27CCCCC3333C3Z3</p>
          </div>
        </div>

        {/* Addresses Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 py-8 border-b text-xs">
          
          {/* Billed To */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BILLED TO (Buyer):</h4>
            <div className="space-y-1 font-semibold">
              <div className="text-sm font-extrabold text-slate-950 dark:text-white print:text-black">
                {order.company_name || 'Individual Retail Customer'}
              </div>
              {order.gst_number && (
                <div className="text-blue-600 dark:text-cyan-400 font-extrabold">GSTIN: {order.gst_number}</div>
              )}
              <div className="text-slate-500">
                {order.billing_address?.line1}, {order.billing_address?.line2 && `${order.billing_address.line2}, `}
                {order.billing_address?.city}, {order.billing_address?.state} - {order.billing_address?.postalCode}
              </div>
            </div>
          </div>

          {/* Shipped To */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SHIPPED TO (Delivery Location):</h4>
            <div className="space-y-1 font-semibold text-slate-500">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-300 print:text-black">
                {order.company_name || 'Individual Customer'}
              </div>
              <div>
                {order.shipping_address?.line1}, {order.shipping_address?.line2 && `${order.shipping_address.line2}, `}
                {order.shipping_address?.city}, {order.shipping_address?.state} - {order.shipping_address?.postalCode}
              </div>
              {order.delivery_notes && (
                <div className="text-[10px] italic text-slate-400 pt-1">Notes: "{order.delivery_notes}"</div>
              )}
            </div>
          </div>

        </div>

        {/* Itemised Invoice Table */}
        <div className="py-8 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b text-slate-400 font-bold uppercase text-[10px] pb-3">
                <th className="py-3">Product Description</th>
                <th className="py-3 text-center">HSN</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Taxable Unit Rate</th>
                <th className="py-3 text-center">GST %</th>
                <th className="py-3 text-right">CGST</th>
                <th className="py-3 text-right">SGST</th>
                <th className="py-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => {
                const prod = item.product || {};
                const taxableVal = item.price * item.quantity;
                const halfGst = item.gst_amount / 2;

                return (
                  <tr key={item.id} className="border-b last:border-b-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/10">
                    <td className="py-4 font-bold text-slate-900 dark:text-white max-w-xs truncate print:text-black">
                      {prod.name || 'Adhesive Formulation'}
                    </td>
                    <td className="py-4 text-center font-semibold text-slate-500">{prod.hsn_code || '35069190'}</td>
                    <td className="py-4 text-center font-bold text-slate-850 dark:text-white">{item.quantity}</td>
                    <td className="py-4 text-right font-semibold">₹{parseFloat(item.price).toFixed(2)}</td>
                    <td className="py-4 text-center font-semibold text-slate-500">{item.gst_percent}%</td>
                    <td className="py-4 text-right font-semibold text-slate-500">₹{halfGst.toFixed(2)}</td>
                    <td className="py-4 text-right font-semibold text-slate-500">₹{halfGst.toFixed(2)}</td>
                    <td className="py-4 text-right font-extrabold font-display text-slate-950 dark:text-white print:text-black">
                      ₹{parseFloat(item.total).toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Totals split boxes */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-start gap-8 text-xs">
          
          {/* Declaration/Terms */}
          <div className="max-w-md space-y-2">
            <h5 className="font-extrabold uppercase text-[10px] text-slate-400">Declaration & Terms:</h5>
            <p className="text-[10px] leading-relaxed text-slate-400">
              We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. All chemical storage must comply with standard MSDS ventilation parameters. Subject to Mumbai Jurisdiction.
            </p>
            <div className="pt-4 flex items-center text-[10px] text-slate-500 gap-1.5">
              <ShieldCheck className="h-4.5 w-4.5 text-blue-500" />
              <span>Computer Generated Document. No Signature Required.</span>
            </div>
          </div>

          {/* Pricing breakdowns */}
          <div className="w-full md:w-80 space-y-2.5">
            <div className="flex justify-between font-semibold text-slate-500">
              <span>Total Taxable Amount:</span>
              <span className="text-slate-850 dark:text-slate-200">₹{parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 border-b pb-2">
              <span>CGST Share (Central):</span>
              <span>₹{parseFloat(order.cgst).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-500 border-b pb-2">
              <span>SGST Share (State):</span>
              <span>₹{parseFloat(order.sgst).toFixed(2)}</span>
            </div>
            
            {parseFloat(order.discount) > 0 && (
              <div className="flex justify-between text-cyan-600 font-bold">
                <span>Coupon Applied Code Discount:</span>
                <span>-₹{parseFloat(order.discount).toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-slate-500">
              <span>Logistics Shipping:</span>
              <span>{parseFloat(order.shipping) === 0 ? "Free Delivery" : `₹${parseFloat(order.shipping).toFixed(2)}`}</span>
            </div>

            <div className="flex justify-between text-base font-extrabold text-slate-950 dark:text-white pt-3 border-t print:text-black">
              <span>Grand Payable Total:</span>
              <span>₹{parseFloat(order.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
