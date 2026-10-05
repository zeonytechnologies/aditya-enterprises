const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.jsx', 'utf8');

// 1. Add forgotPassword to useAuth
code = code.replace(/const \{ login, register \} = useAuth\(\);/, 'const { login, register, forgotPassword } = useAuth();');

// 2. Add forgot states
code = code.replace(/const \[activeTab, setActiveTab\] = useState\('login'\); \/\/ 'login' or 'register'/,
`const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register' or 'forgot'
  
  // Forgot Password States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotGeneratedOtp, setForgotGeneratedOtp] = useState('');
  const [forgotEnteredOtp, setForgotEnteredOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');`);

// 3. Add handleForgotSubmit
const handleForgotSubmitCode = `
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (forgotStep === 1) {
      if (!forgotEmail) return;
      setLoading(true);
      try {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        setForgotGeneratedOtp(otp);
        await sendEmail({
          to: forgotEmail,
          subject: 'Password Reset OTP',
          html: \`<div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px;"><h2>Password Reset</h2><p>Your OTP for password reset is:</p><h1 style="background: #f1f5f9; padding: 10px; display: inline-block; letter-spacing: 5px;">\${otp}</h1></div>\`
        });
        setForgotStep(2);
      } catch (err) {
        setError('Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else if (forgotStep === 2) {
      if (forgotEnteredOtp !== forgotGeneratedOtp) {
        setError('Invalid OTP. Please try again.');
        return;
      }
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (!forgotNewPassword || forgotNewPassword.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      setLoading(true);
      try {
        await forgotPassword(forgotEmail, forgotNewPassword);
        setActiveTab('login');
        setForgotStep(1);
        setForgotEmail('');
        setForgotEnteredOtp('');
        setForgotNewPassword('');
        alert('Password successfully reset. You can now login.');
      } catch (err) {
        setError(err.message || 'Failed to reset password.');
      } finally {
        setLoading(false);
      }
    }
  };

`;
code = code.replace(/const handleLoginSubmit = async/, handleForgotSubmitCode + 'const handleLoginSubmit = async');

// 4. Add forgot password link
code = code.replace(/<\/div>\s+<\/div>\s+<button\s+type="submit"/s,
`</div>
            </div>
            
            <div className="flex justify-end">
              <button type="button" onClick={() => { setActiveTab('forgot'); setError(''); setForgotStep(1); }} className="text-[10px] text-blue-600 font-bold hover:underline">
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"`);

// 5. Add forgot form
const forgotFormCode = `
        {activeTab === 'forgot' ? (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold">Reset Password</h3>
              <p className="text-xs text-slate-500 mt-1">Follow the steps to recover your account</p>
            </div>
            {forgotStep === 1 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address *</label>
                  <div className="relative">
                    <input type="email" required placeholder="e.g. buyer@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500" />
                    <Mail className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 mt-2">
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </>
            )}
            {forgotStep === 2 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Enter OTP sent to {forgotEmail}</label>
                  <div className="relative">
                    <input type="text" required placeholder="6-digit OTP" maxLength={6} value={forgotEnteredOtp} onChange={(e) => setForgotEnteredOtp(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500" />
                    <KeyRound className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 mt-2">
                  Verify OTP
                </button>
              </>
            )}
            {forgotStep === 3 && (
              <>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password *</label>
                  <div className="relative">
                    <input type="password" required placeholder="Minimum 6 characters" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:ring-2 focus:ring-blue-500" />
                    <Lock className="absolute left-3 top-3.5 h-3.5 w-3.5 text-slate-400" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition text-xs shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5 mt-2">
                  {loading ? "Saving..." : "Change Password"}
                </button>
              </>
            )}
            <button type="button" onClick={() => setActiveTab('login')} className="w-full text-center text-[10px] text-blue-600 font-bold hover:underline mt-4">
              Back to Login
            </button>
          </form>
        ) : activeTab === 'login' ? (
`;

code = code.replace(/\{\/\* Form area \*\/\}\s+\{activeTab === 'login' \? \(/s, '{/* Form area */}\n' + forgotFormCode);

fs.writeFileSync('src/pages/Login.jsx', code);
console.log('Login.jsx updated');
