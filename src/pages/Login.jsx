import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShieldCheck, UserPlus, LogIn, Lock, Mail, User, Building, Phone, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendEmail } from '../services/mailer';

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

  // OTP Verification States
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

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

    if (!showOtp) {
      // Step 1: Send OTP
      setLoading(true);
      try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedOtp(otp);
        
        await sendEmail({
          to: regEmail,
          subject: 'Your Verification OTP',
          html: `
            <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px;">
              <h2>Email Verification</h2>
              <p>Your One Time Password (OTP) for registration is:</p>
              <h1 style="background: #f1f5f9; padding: 10px; display: inline-block; letter-spacing: 5px;">${otp}</h1>
              <p>Please enter this code to proceed.</p>
            </div>
          `
        });
        
        setShowOtp(true);
      } catch (err) {
        setError('Failed to send OTP. Please check your email address.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Step 2: Verify OTP and Register
    if (enteredOtp !== generatedOtp) {
      setError('Invalid OTP. Please try again.');
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
      
      // Send Welcome Email
      await sendEmail({
        to: regEmail,
        subject: 'Welcome to Aditya Enterprises!',
        html: `
          <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; text-align: left;">
            <p style="color: #475569; font-size: 16px;">Our aditya Enterprises team representative will be in touch with you shortly to discuss wholesale price,</p>
            <p style="color: #475569; font-size: 16px;">If you have any questions about ordering online, please call us on <a href="https://wa.me/917483552250">wa.me/917483552250</a> and we would be happy to help you.</p>
            <br />
            <p style="color: #475569; font-size: 16px;">Thank you<br />
            Team:<br />
            ADITYA ENTERPRISES<br />
            Ckpgrouponline@gmail.com</p>
          </div>
        `
      }).catch(err => console.error("Welcome Mail error", err));

      if (redirect === 'checkout') {
        navigate('/checkout');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already be in use.');
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
            type="button"
            onClick={() => { setActiveTab('login'); setError(''); setShowOtp(false); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 font-extrabold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <LogIn className="h-4 w-4" /> Sign In
          </button>
          
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); setShowOtp(false); }}
            className={`flex-1 py-3 text-xs font-bold border-b-2 flex items-center justify-center gap-1.5 transition ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400 font-extrabold'
                : 'border-transparent text-slate-400'
            }`}
          >
            <UserPlus className="h-4 w-4" /> Create Account
          </button>
        </div>

        {/* Error Box */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-bold flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Form area */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email or Username *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. buyer@example.com or user123"
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
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>

          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {showOtp ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Enter OTP sent to {regEmail}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="h-5 w-5" />
                    </div>
                    <input
                      type="text"
                      value={enteredOtp}
                      onChange={(e) => setEnteredOtp(e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                      placeholder="6-digit OTP"
                      maxLength={6}
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Verifying...' : 'Verify & Register'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="w-full text-center text-[10px] text-blue-600 font-bold hover:underline"
                >
                  Back to details
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Mehta"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
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
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                    <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5 border-t pt-3 border-slate-100 dark:border-slate-800">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Account Tier *</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="customer">Retail Customer (Standard Pricing)</option>
                    <option value="dealer">Wholesale B2B Dealer (Discount Pricing)</option>
                  </select>
                </div>

                {/* Extra B2B Inputs */}
                {regRole === 'dealer' && (
                  <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 border border-slate-200 dark:border-slate-800 rounded-2xl animate-fade-in">
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Company Name *</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Mehta Fabricators Ltd"
                          value={regCompany}
                          onChange={(e) => setRegCompany(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                        <Building className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GSTIN (Optional)</label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. 27AAAAA1111A1Z1"
                          value={regGst}
                          onChange={(e) => setRegGst(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                        <ShieldCheck className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number *</label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +91 98765 43210"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500"
                        />
                        <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      </div>
                    </div>

                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      placeholder="Minimum 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500"
                    />
                    <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-slate-900 font-bold rounded-xl transition text-xs flex items-center justify-center gap-1.5 mt-2"
                >
                  {loading ? "Sending OTP..." : "Continue with Registration"}
                </button>
              </>
            )}
          </form>
        )}
      </div>

    </div>
  );
}
