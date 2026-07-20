import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, QrCode, Building, Upload, 
  ArrowRight, ShieldCheck, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { api } from '../services/supabase';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' or 'Bank'

  // Payment Form States
  const [utrNumber, setUtrNumber] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentNotes, setPaymentNotes] = useState('');
  const [screenshotBase64, setScreenshotBase64] = useState('');
  const [screenshotName, setScreenshotName] = useState('');

  const [formError, setFormError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!orderId) {
      navigate('/shop');
      return;
    }
    const loadOrder = async () => {
      setLoading(true);
      try {
        const ord = await api.orders.getById(orderId);
        if (!ord) {
          navigate('/shop');
          return;
        }
        setOrder(ord);
        setAmountPaid(ord.grand_total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId, navigate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!utrNumber.trim()) {
      setFormError('Please enter the UTR / Transaction Reference Number.');
      return;
    }

    if (parseFloat(amountPaid) <= 0) {
      setFormError('Amount paid must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      await api.payments.submit({
        order_id: orderId,
        method: paymentMethod,
        utr_number: utrNumber.trim(),
        amount: parseFloat(amountPaid),
        screenshot_url: screenshotBase64 || null, // saved in DB as base64 string
        transaction_date: transactionDate,
        notes: paymentNotes
      });

      setSubmitSuccess(true);
      // Removed automatic redirect to let user see the WhatsApp button
    } catch (err) {
      console.error(err);
      setFormError('This UTR reference number has already been submitted for verification.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 min-h-screen skeleton rounded-3xl" />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* Top Breadcrumb Header */}
      <div className="text-center space-y-3 mb-10">
        <h1 className="text-3xl font-extrabold font-display">B2B Offline Payment Portal</h1>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
          Order ID: <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{order?.display_id || orderId.substring(0,8)}</span> • Payable Grand Total: <span className="text-slate-950 dark:text-white font-extrabold">₹{order?.grand_total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </p>
      </div>

      {submitSuccess ? (
        <div className="bg-white dark:bg-slate-900 border rounded-3xl p-10 text-center space-y-6 shadow-xl max-w-lg mx-auto">
          <div className="h-16 w-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold font-display">Payment Uploaded Successfully!</h2>
          
          <div className="bg-slate-50 dark:bg-slate-950 border border-dashed rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Order ID:</span>
              <span className="text-slate-900 dark:text-white">CKP/ONLINE/ORDER/{String(order?.display_id || 1).padStart(4, '0')}</span>
            </div>
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-500">Proforma Invoice:</span>
              <span className="text-slate-900 dark:text-white">CKP/ONLINE/2026-27/{String(order?.display_id || 1).padStart(4, '0')}</span>
            </div>
          </div>
          
          <p className="text-xs text-slate-450 leading-relaxed mx-auto">
            Your transaction references have been successfully filed. Orders will sit as <strong>Pending Verification</strong> until manual checking completes.
          </p>
          
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button 
              onClick={() => {
                const message = `Hello Aditya Enterprises,%0A%0AI have placed a new order and uploaded the payment details.%0A%0A*Order ID:* CKP/ONLINE/ORDER/${String(order?.display_id || 1).padStart(4, '0')}%0A*Total Amount:* ₹${order?.grand_total.toLocaleString('en-IN')}%0A%0APlease verify and process my order quickly. Thank you!`;
                window.open(`https://wa.me/919342248827?text=${message}`, '_blank');
              }}
              className="py-3 px-4 bg-[#25D366] hover:bg-[#128C7E] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Send to WhatsApp
            </button>
            <button 
              onClick={() => navigate(`/order-tracking?orderId=${orderId}`)}
              className="py-3 px-4 bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Track Order Status <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* LEFT: Instructions (QR & Bank details) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Method tab toggles */}
            <div className="bg-white dark:bg-slate-900 border rounded-2xl p-2.5 flex shadow-sm gap-2">
              <button
                onClick={() => setPaymentMethod('UPI')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'UPI'
                    ? 'bg-slate-900 text-white dark:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                <QrCode className="h-4.5 w-4.5" /> UPI Scan
              </button>
              <button
                onClick={() => setPaymentMethod('Bank')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                  paymentMethod === 'Bank'
                    ? 'bg-slate-900 text-white dark:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                <Building className="h-4.5 w-4.5" /> Bank Transfer
              </button>
            </div>

            {/* Payment Coordinates details card */}
            <div className="bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              {paymentMethod === 'UPI' ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold font-display text-slate-800 dark:text-white uppercase tracking-wider">UPI QR code</h3>
                  <div className="h-48 w-48 bg-slate-100 border p-3.5 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                    {/* Simulated QR Code Canvas design */}
                    <div className="h-full w-full bg-slate-950 rounded-xl relative flex items-center justify-center text-white text-[9px] font-bold tracking-widest uppercase">
                      <div className="absolute top-2 left-2 h-4 w-4 border-2 border-white" />
                      <div className="absolute top-2 right-2 h-4 w-4 border-2 border-white" />
                      <div className="absolute bottom-2 left-2 h-4 w-4 border-2 border-white" />
                      QR CODE
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-semibold">UPI ID Reference</p>
                    <p className="text-xs font-extrabold text-slate-800 dark:text-white">pay@adityaenterprises</p>
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed">
                    Scan using standard corporate banking applications (BHIM, HDFC Pay, GPay, PhonePe).
                  </p>
                </div>
              ) : (
                <div className="space-y-5 w-full text-left">
                  <h3 className="text-sm font-bold font-display text-slate-800 dark:text-white uppercase tracking-wider text-center">Bank Transfer Coordinates</h3>
                  
                  <div className="space-y-3.5 text-xs">
                    <div className="border-b pb-2 flex justify-between">
                      <span className="text-slate-400 font-medium">Account Name:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">Aditya Enterprises</span>
                    </div>
                    <div className="border-b pb-2 flex justify-between">
                      <span className="text-slate-400 font-medium">Bank Name:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">HDFC Bank Ltd</span>
                    </div>
                    <div className="border-b pb-2 flex justify-between">
                      <span className="text-slate-400 font-medium">Account Number:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">50200012345678</span>
                    </div>
                    <div className="border-b pb-2 flex justify-between">
                      <span className="text-slate-400 font-medium">IFSC Code:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">HDFC0000123</span>
                    </div>
                    <div className="border-b pb-2 flex justify-between">
                      <span className="text-slate-400 font-medium">Account Type:</span>
                      <span className="font-extrabold text-slate-800 dark:text-white">Current Account</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed text-center">
                    Transfer funds via NEFT, RTGS or IMPS. Keep the transaction reference UTR secure.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT: Transaction reference submission Form */}
          <div className="md:col-span-7 bg-white dark:bg-slate-900 border rounded-3xl p-6 md:p-8 shadow-sm h-fit">
            <h3 className="text-base font-extrabold font-display border-b pb-3 mb-5">Confirm Transaction Receipt</h3>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">UTR / IMPS Transaction Reference Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789012 (usually 12 or 22 digits)"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transaction Date *</label>
                  <input
                    type="date"
                    required
                    value={transactionDate}
                    onChange={(e) => setTransactionDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exact Amount Transferred (₹) *</label>
                  <input
                    type="number"
                    required
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* File Screenshot Upload */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Upload Payment Confirmation Screenshot *</label>
                <div className="border border-dashed border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 text-center cursor-pointer hover:bg-slate-100 transition relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center space-y-1">
                    <Upload className="h-6 w-6 text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">
                      {screenshotName ? `Selected: ${screenshotName}` : 'Upload JPG, PNG receipt proof'}
                    </span>
                    <span className="text-[9px] text-slate-400">Click to choose or drag here</span>
                  </div>
                </div>
                {screenshotBase64 && (
                  <div className="mt-2 h-20 w-32 border rounded-xl overflow-hidden bg-white flex items-center justify-center mx-auto">
                    <img src={screenshotBase64} alt="Receipt preview" className="max-h-full max-w-full object-contain" />
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Additional Transaction Notes</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Paid via HDFC net banking from Mehta corporate account."
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl text-xs bg-slate-50 dark:bg-slate-950"
                />
              </div>

              {formError && (
                <p className="text-xs text-red-500 font-bold border bg-red-50 dark:bg-red-950/20 p-3 rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5 text-red-500" /> {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-750 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-md shadow-blue-500/20"
              >
                {loading ? "Filing Reference..." : "Submit Payment details"}
                <ArrowRight className="h-4 w-4" />
              </button>

            </form>
          </div>

        </div>
      )}

      {/* RLS / Compliance Shield warning footer */}
      <div className="mt-12 bg-slate-100/50 dark:bg-slate-900/30 p-4 border rounded-2xl flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-[10px] text-slate-500 leading-relaxed">
          <strong className="text-slate-800 dark:text-white font-bold block mb-0.5">B2B Financial Auditing Compliance</strong>
          All manual payments are archived and audited. Fraudulent UTR submissions or editing proof receipts will result in MSME dealer account suspension.
        </div>
      </div>

    </div>
  );
}
