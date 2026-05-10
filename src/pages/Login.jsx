import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { Mail, Lock, Eye, EyeOff, Compass } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login'); // login | signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);

  const { signIn, signUp, signInWithGoogle, resetPassword } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Enter a valid email';
    if (!forgotMode && password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setLoading(true);

    try {
      if (forgotMode) {
        await resetPassword(email);
        addToast('Password reset email sent — check your inbox');
        setForgotMode(false);
      } else if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/dashboard');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        addToast('Account created! Check email to confirm.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      setError('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — illustration panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-sand-100 items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative shapes */}
        <div className="absolute top-12 left-12 w-32 h-32 rounded-full bg-sunset-500/10" />
        <div className="absolute bottom-24 right-16 w-48 h-48 rounded-full bg-ocean-500/10" />
        <div className="absolute top-1/3 right-24 w-20 h-20 rounded-2xl bg-forest-500/10 rotate-12" />

        <div className="relative z-10 max-w-md text-center">
          {/* Illustrated icon cluster */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-16 bg-sunset-500/15 rounded-2xl flex items-center justify-center rotate-[-6deg]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F05A2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <div className="w-20 h-20 bg-ocean-500/15 rounded-2xl flex items-center justify-center rotate-[3deg]">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1D6FB8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <div className="w-16 h-16 bg-forest-500/15 rounded-2xl flex items-center justify-center rotate-[8deg]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2D8259" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
            </div>
          </div>

          <h1 className="font-[family-name:var(--font-family-heading)] text-4xl font-bold text-ink-900 mb-4 leading-tight">
            Plan trips that<br />feel effortless
          </h1>
          <p className="text-ink-400 text-base leading-relaxed">
            Organize stops, track budgets, and keep every detail in one beautiful place. Your next adventure starts here.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {['Itineraries', 'Budgets', 'Checklists', 'Notes', 'Collaboration'].map((f) => (
              <span key={f} className="px-3 py-1.5 bg-white/60 rounded-full text-xs font-medium text-ink-700 border border-sand-200">
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 bg-sunset-500 rounded-lg flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-[family-name:var(--font-family-heading)] text-xl font-semibold text-ink-900">Traveloop</span>
          </div>

          {forgotMode ? (
            <>
              <h2 className="font-[family-name:var(--font-family-heading)] text-2xl font-bold text-ink-900 mb-1">Reset password</h2>
              <p className="text-ink-400 text-sm mb-6">We'll send you a reset link</p>
            </>
          ) : (
            <>
              <h2 className="font-[family-name:var(--font-family-heading)] text-2xl font-bold text-ink-900 mb-6">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>

              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-sand-100 rounded-xl mb-6">
                {['login', 'signup'].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(''); }}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      mode === m ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-400 hover:text-ink-700'
                    }`}
                  >
                    {m === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-ink-700 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            {!forgotMode && (
              <div>
                <label className="block text-xs font-medium text-ink-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-200" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-sand-200 text-sm text-ink-900 placeholder:text-ink-200 focus:outline-none focus:ring-2 focus:ring-sunset-500/30 focus:border-sunset-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-200 hover:text-ink-400"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-sunset-600 bg-sunset-500/5 px-3 py-2 rounded-lg">{error}</p>
            )}

            {/* Forgot password link */}
            {mode === 'login' && !forgotMode && (
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(''); }}
                className="text-xs text-ocean-500 hover:text-ocean-600 font-medium transition-colors"
              >
                Forgot password?
              </button>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-sunset-500 text-white font-semibold rounded-xl text-sm hover:bg-sunset-600 disabled:opacity-50 transition-colors duration-200 ease-out"
            >
              {loading
                ? 'Please wait…'
                : forgotMode
                ? 'Send Reset Link'
                : mode === 'login'
                ? 'Log In'
                : 'Create Account'}
            </button>

            {forgotMode && (
              <button
                type="button"
                onClick={() => { setForgotMode(false); setError(''); }}
                className="w-full text-sm text-ink-400 hover:text-ink-700 transition-colors"
              >
                ← Back to login
              </button>
            )}
          </form>

          {/* OAuth */}
          {!forgotMode && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-sand-200" />
                <span className="text-xs text-ink-200 uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-sand-200" />
              </div>

              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-2 py-2.5 border border-sand-200 rounded-xl text-sm font-medium text-ink-700 hover:bg-sand-50 transition-colors duration-200 ease-out"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
