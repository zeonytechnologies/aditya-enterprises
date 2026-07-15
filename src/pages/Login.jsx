import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, Lock, Mail, User, Building, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || 'dashboard';

  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration Form States
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regRole, setRegRole] = useState('customer'); // 'customer' or 'dealer'
  const [regCompany, setRegCompany] = useState('');
  const [regGst, setRegGst] = useState('');
  const [regPhone, setRegPhone] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!regEmail || !regPassword || !regName) {
      setError('Please fill in all required fields.');
      return;
    }

    if (regRole === 'dealer' && (!regCompany || !regPhone)) {
      setError('Please enter your Company Name and Phone Number for dealer verification.');
      return;
    }

    setLoading(true);
    try {
      await register(
        regEmail,
        regPassword,
        regName,
        regCompany,
        regGst,
        regRole,
        regPhone
      );
      
      if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4 font-sans text-slate-900 dark:text-white">
      
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Logo/Identity banner */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold tracking-wide font-display">
            ADITYA <span className="text-blue-600 dark:text-cyan-400">ENTERPRISES</span>
          </h2>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
            B2B / B2C Adhesives Portal
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => { setActiveTab('login'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 font-extrabold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          
          <button
            onClick={() => { setActiveTab('register'); setError(''); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 font-extrabold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Create Account
          </button>
        </div>

        {/* Form area */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. buyer@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                />
                <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-755 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>

          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Mehta"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                <User className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="e.g. purchase@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs"
                />
                <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>

            <div className="space-y-1.5 border-t pt-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Tier *</label>
              <select
                value={regRole}
                onChange={(e) => setRegRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold"
              >
                <option value="customer">Retail Customer (Standard Pricing)</option>
                <option value="dealer">Wholesale B2B Dealer (Discount Pricing)</option>
              </select>
            </div>

            {/* Extra B2B Inputs */}
            {regRole === 'dealer' && (
              <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 border rounded-2xl animate-fade-in">
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Company Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mehta Fabricators Ltd"
                      value={regCompany}
                      onChange={(e) => setRegCompany(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-white dark:bg-slate-900"
                    />
                    <Building className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">GSTIN (Optional)</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. 27AAAAA1111A1Z1"
                      value={regGst}
                      onChange={(e) => setRegGst(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-white dark:bg-slate-900"
                    />
                    <ShieldCheck className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Phone Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-xl text-xs bg-white dark:bg-slate-900"
                    />
                    <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-755 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
            >
              {loading ? "Registering Account..." : "Create Account"}
            </button>

          </form>
        )}

        {error && (
          <p className="text-xs text-red-500 font-bold border border-red-200 bg-red-50 p-3 rounded-xl">
            ⚠️ {error}
          </p>
        )}

        {/* Demo instructions */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl text-[10px] text-slate-400 leading-relaxed">
          <strong className="text-slate-700 dark:text-slate-350 block mb-1">Testing accounts available:</strong>
          <div>Admin: <strong className="text-slate-800 dark:text-white">admin@example.com</strong> / password</div>
          <div>Dealer: <strong className="text-slate-800 dark:text-white">dealer@example.com</strong> / password</div>
          <div>Customer: <strong className="text-slate-800 dark:text-white">customer@example.com</strong> / password</div>
        </div>

      </div>

    </div>
  );
}
