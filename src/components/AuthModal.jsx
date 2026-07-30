import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, ArrowRight, RefreshCw, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse JWT payload', e);
    return null;
  }
}

export default function AuthModal({ isOpen, onClose, onOpenGoogle }) {
  const { signup, verifyOTP, resendOTP, login, googleLogin, pendingOTP } = useAuth();

  const [view, setView] = useState('signin'); // 'signin' | 'signup' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSuccessAnim, setIsSuccessAnim] = useState(false);

  // Sign In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign Up state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm] = useState('');

  // OTP State
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [activeCodeBanner, setActiveCodeBanner] = useState('');
  const otpInputsRef = useRef([]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccessMsg('');
      setIsSuccessAnim(false);
      if (pendingOTP) {
        setView('otp');
        setActiveCodeBanner(pendingOTP.code);
      }
    }
  }, [isOpen, pendingOTP]);

  // Google Identity Services (GIS) button initialization
  useEffect(() => {
    if (isOpen && view === 'signin') {
      const handleGoogleResponse = (response) => {
        const payload = parseJwt(response.credential);
        if (payload) {
          googleLogin({
            name: payload.name || payload.given_name || 'Google User',
            email: payload.email,
            avatar: payload.picture,
            sub: payload.sub,
          });
          onClose();
        }
      };

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1082522770281-simulatedclientid.apps.googleusercontent.com';

      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleResponse,
          });

          const btnContainer = document.getElementById('googleSignInBtn');
          if (btnContainer) {
            window.google.accounts.id.renderButton(btnContainer, {
              theme: 'outline',
              size: 'large',
              width: '100%',
              shape: 'pill',
            });
          }
        } catch (err) {
          console.warn('GIS init:', err);
        }
      }
    }
  }, [isOpen, view, googleLogin, onClose]);

  // OTP Countdown timer
  useEffect(() => {
    let interval = null;
    if (view === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view, timer]);

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    try {
      login(loginEmail, loginPassword);
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Signup
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirm) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const res = signup(signupName, signupEmail, signupPassword);
      setActiveCodeBanner(res.otp);
      setTimer(30);
      setOtpValues(['', '', '', '', '', '']);
      setView('otp');
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle OTP Inputs
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newValues = [...otpValues];
    newValues[index] = value.slice(-1);
    setOtpValues(newValues);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setOtpValues(digits);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Handle OTP Submission
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    setError('');

    const fullCode = otpValues.join('');
    if (fullCode.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      return;
    }

    try {
      verifyOTP(fullCode);
      setIsSuccessAnim(true);
      setTimeout(() => {
        setIsSuccessAnim(false);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Resend OTP
  const handleResend = () => {
    const newCode = resendOTP();
    if (newCode) {
      setActiveCodeBanner(newCode);
      setTimer(30);
      setSuccessMsg('New 6-digit code sent to your email.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white/90 dark:bg-slate-900/90 rounded-3xl border border-white/40 dark:border-slate-800 backdrop-blur-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-brand-600 via-cyber-purple to-cyber-cyan p-0.5">
              <div className="w-full h-full bg-white dark:bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {view === 'signin' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Verify Email OTP'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold animate-slide-up">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-slide-up">
              {successMsg}
            </div>
          )}

          {/* 1. SIGN IN VIEW */}
          {view === 'signin' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 btn-interactive transition"
              >
                Sign In
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-[10px] uppercase font-mono font-bold text-slate-400">
                  Or continue with
                </span>
              </div>

              {/* Official Google Sign-In GIS Render Button Container */}
              <div id="googleSignInBtn" className="w-full flex justify-center min-h-[40px]">
                <button
                  type="button"
                  onClick={onOpenGoogle}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-center gap-2.5 shadow-xs btn-interactive transition"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              </div>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setView('signup');
                    }}
                    className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 2. SIGN UP VIEW */}
          {view === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Rivera"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Repeat password"
                    value={signupConfirm}
                    onChange={(e) => setSignupConfirm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 btn-interactive transition flex items-center justify-center gap-2"
              >
                <span>Continue to OTP Verification</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setView('signin');
                    }}
                    className="font-bold text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* 3. EMAIL OTP VERIFICATION VIEW */}
          {view === 'otp' && (
            <form onSubmit={handleVerifySubmit} className="space-y-4 text-center">
              {isSuccessAnim ? (
                <div className="py-8 flex flex-col items-center justify-center space-y-3 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Email Verified Successfully!</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Logging you into Synapse.ai...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-cyan-400 flex items-center justify-center mb-2">
                      <KeyRound className="w-6 h-6" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      We sent a 6-digit verification code to:
                    </p>
                    <p className="text-xs font-mono font-bold text-indigo-600 dark:text-cyan-400">
                      {pendingOTP?.email || signupEmail || 'your email'}
                    </p>
                  </div>

                  {/* Testing Banner displaying active code */}
                  {activeCodeBanner && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-mono flex items-center justify-between">
                      <span>Simulated Email OTP:</span>
                      <span className="font-bold text-sm tracking-widest bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-500/30">
                        {activeCodeBanner}
                      </span>
                    </div>
                  )}

                  {/* 6 Input Boxes */}
                  <div className="flex items-center justify-center gap-2 py-2" onPaste={handleOtpPaste}>
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-10 h-12 text-center text-base font-mono font-bold rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                    <span>Didn't receive code?</span>
                    <button
                      type="button"
                      disabled={timer > 0}
                      onClick={handleResend}
                      className={`font-semibold flex items-center gap-1 ${
                        timer > 0
                          ? 'text-slate-400 cursor-not-allowed'
                          : 'text-indigo-600 dark:text-cyan-400 hover:underline cursor-pointer'
                      }`}
                    >
                      <RefreshCw className={`w-3 h-3 ${timer > 0 ? '' : 'animate-spin'}`} />
                      <span>{timer > 0 ? `Resend in ${timer}s` : 'Resend Code'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 btn-interactive transition"
                  >
                    Verify Email & Log In
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
