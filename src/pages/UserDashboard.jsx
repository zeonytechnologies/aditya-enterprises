import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShoppingBag, ClipboardList, MapPin, 
  User, CheckCircle, Clock, AlertTriangle, Eye, Download, ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/supabase';

export default function UserDashboard() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'quotes', 'address', 'profile'
  const [orders, setOrders] = useState([]);
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    line1: user?.address_line1 || '',
    line2: user?.address_line2 || '',
    city: user?.city || '',
    state: user?.state || 'Maharashtra',
    postalCode: user?.postal_code || '',
  });
  const [addressSaved, setAddressSaved] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: user?.full_name || '',
    companyName: user?.company_name || '',
    gstNumber: user?.gst_number || '',
    phone: user?.phone || '',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const ords = await api.orders.list(user.id);
        setOrders(ords);

        const quotes = await api.rfqs.list(user.id);
        setRfqs(quotes);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate]);

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In localStorage mode, we find the users list and update the user object
      const allUsers = await api.admin.getUsersList();
      const updatedList = allUsers.map(u => {
        if (u.id === user.id) {
          return {
            ...u,
            address_line1: addressForm.line1,
            address_line2: addressForm.line2,
            city: addressForm.city,
            state: addressForm.state,
            postal_code: addressForm.postalCode
          };
        }
        return u;
      });
      localStorage.setItem('aditya_users', JSON.stringify(updatedList));
      await refreshProfile();

      setAddressSaved(true);
      setTimeout(() => setAddressSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user?.id) {
        await api.auth.updateProfile(user.id, {
          full_name: profileForm.fullName,
          company_name: profileForm.companyName,
          gst_number: profileForm.gstNumber,
          phone: profileForm.phone
        });
      } else {
        // Fallback for local dev testing
        const allUsers = await api.admin.getUsersList();
        const updatedList = allUsers.map(u => {
          if (u.id === user.id) {
            return {
              ...u,
              full_name: profileForm.fullName,
              company_name: profileForm.companyName,
              gst_number: profileForm.gstNumber,
              phone: profileForm.phone
            };
          }
          return u;
        });
        localStorage.setItem('aditya_users', JSON.stringify(updatedList));
      }
      
      await refreshProfile();

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ";
    if (status === 'Delivered' || status === 'Payment Verified') {
      return base + "bg-green-50 text-green-700 border border-green-200";
    }
    if (status === 'Cancelled' || status === 'Rejected') {
      return base + "bg-red-50 text-red-700 border border-red-200";
    }
    return base + "bg-amber-50 text-amber-700 border border-amber-200";
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
      
      {/* Welcome Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md mb-10 border border-slate-800">
        <div>
          <span className="text-[10px] text-blue-500 dark:text-cyan-400 font-extrabold uppercase tracking-widest">
            Logged In Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display mt-1">
            Welcome back, {user.full_name}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {user.company_name ? `Corporate Account: ${user.company_name} · GSTIN: ${user.gst_number || 'N/A'}` : 'Retail Account Member'}
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-xl uppercase">
            Tier: {user.role}
          </span>
          {user.role !== 'customer' && (
            <span className="px-3.5 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold rounded-xl uppercase flex items-center gap-1">
              <ShieldCheck className="h-4 w-4" /> Approved
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT: Sidebar Navigation Tabs */}
        <aside className="lg:col-span-3 space-y-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm h-fit">
          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <ShoppingBag className="h-4.5 w-4.5" /> My Orders ({orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab('quotes')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${
              activeTab === 'quotes'
                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <ClipboardList className="h-4.5 w-4.5" /> B2B Bulk Quotes ({rfqs.length})
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${
              activeTab === 'address'
                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <MapPin className="h-4.5 w-4.5" /> Address Book
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <User className="h-4.5 w-4.5" /> Profile Settings
          </button>
        </aside>

        {/* RIGHT: Content panels */}
        <main className="lg:col-span-9">
          
          {/* TAB 1: My Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display">My Purchase History</h2>
              
              {loading ? (
                <div className="h-40 w-full rounded-2xl skeleton" />
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div 
                      key={ord.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Order ID Reference</p>
                          <p className="text-sm font-extrabold">{ord.display_id || ord.id.substring(0,8)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left sm:text-right">Order Date</p>
                          <p className="text-xs font-semibold text-slate-500">{new Date(ord.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className={getStatusBadge(ord.status)}>{ord.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs">
                          <span className="text-slate-400 block">Total Items count:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">
                            {ord.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} formulation packs
                          </span>
                        </div>
                        <div className="text-xs">
                          <span className="text-slate-400 block">Grand Total Paid:</span>
                          <span className="font-extrabold text-slate-900 dark:text-white text-base font-display">
                            ₹{parseFloat(ord.grand_total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/order-tracking?orderId=${ord.id}`}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                          >
                            <Eye className="h-3.5 w-3.5" /> Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl space-y-3">
                  <div className="text-3xl">📦</div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Orders Placed Yet</h3>
                  <Link to="/shop" className="text-xs text-blue-600 hover:underline">Explore the catalog to order</Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RFQs Bulk quotes */}
          {activeTab === 'quotes' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold font-display">Requested RFQ Quotations</h2>

              {loading ? (
                <div className="h-40 w-full rounded-2xl skeleton" />
              ) : rfqs.length > 0 ? (
                <div className="space-y-4">
                  {rfqs.map((rfq) => (
                    <div 
                      key={rfq.id}
                      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4"
                    >
                      <div className="flex justify-between items-center border-b pb-3 flex-wrap gap-2">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">RFQ Reference ID</p>
                          <p className="text-sm font-bold">{rfq.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Requested Date</p>
                          <p className="text-xs text-slate-500 font-semibold">{new Date(rfq.created_at).toLocaleDateString()}</p>
                        </div>
                        <span className={getStatusBadge(rfq.status)}>{rfq.status}</span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-slate-400 font-bold block mb-0.5">Procurement Details:</span>
                          <p className="text-slate-650 dark:text-slate-350 p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl italic">"{rfq.requirement}"</p>
                        </div>
                        <div>
                          <span className="text-slate-400 font-bold">Inquired volume count:</span> <strong className="text-slate-800 dark:text-slate-200">{rfq.quantity} packs</strong>
                        </div>
                      </div>

                      {rfq.status === 'Responded' && rfq.response_quotation && (
                        <div className="mt-4 p-4 bg-blue-50/50 dark:bg-slate-950 border border-blue-150 rounded-2xl space-y-3">
                          <h4 className="text-xs font-bold text-blue-800 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="h-4.5 w-4.5" /> Admin Quoted Price Contract
                          </h4>
                          
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-450 block font-semibold">Wholesale Contract Price Offered:</span>
                              <strong className="text-slate-900 dark:text-white text-sm">₹{parseFloat(rfq.response_quotation.offeredPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                            </div>
                            <div>
                              <span className="text-slate-450 block font-semibold">Validity Period:</span>
                              <strong className="text-slate-900 dark:text-white">{rfq.response_quotation.validTill || '30 Days'}</strong>
                            </div>
                          </div>
                          {rfq.response_quotation.remarks && (
                            <p className="text-[11px] text-slate-500 italic">"Remarks: {rfq.response_quotation.remarks}"</p>
                          )}
                          <div className="pt-2 border-t flex justify-end">
                            <button
                              onClick={() => alert("Downloading Admin Quotation Invoice Proposal Contract PDF.")}
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-750 text-white text-xs font-bold rounded-xl transition flex items-center gap-1"
                            >
                              <Download className="h-3.5 w-3.5" /> Download Contract PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white dark:bg-slate-900 border rounded-2xl space-y-3">
                  <div className="text-3xl">📋</div>
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-350">No Bulk RFQs Filed</h3>
                  <a href="/#rfq" className="text-xs text-blue-600 hover:underline">Submit a bulk quote request</a>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Address Book */}
          {activeTab === 'address' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-display border-b pb-3">Logistics Shipping Coordinates</h2>
              
              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.line1}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, line1: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Address Line 2</label>
                  <input
                    type="text"
                    value={addressForm.line2}
                    onChange={(e) => setAddressForm(prev => ({ ...prev, line2: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">City *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">State *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Postal Code *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm(prev => ({ ...prev, postalCode: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {addressSaved && (
                  <p className="text-xs text-green-500 font-bold">Address details updated successfully.</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Save Address
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h2 className="text-xl font-bold font-display border-b pb-3">Corporate Profile coordinates</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.fullName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name</label>
                    <input
                      type="text"
                      value={profileForm.companyName}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, companyName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN / Tax ID</label>
                    <input
                      type="text"
                      value={profileForm.gstNumber}
                      onChange={(e) => setProfileForm(prev => ({ ...prev, gstNumber: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {profileSaved && (
                  <p className="text-xs text-green-500 font-bold">Profile coordinates updated successfully.</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition"
                >
                  Save Profile
                </button>
              </form>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
