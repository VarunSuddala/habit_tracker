import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../layout/MobileContainer';

const Onboarding = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Quick demo login
  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('demo@antigravite.com', 'password123');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell className="!bg-primary-purple" showSidebar={false}>
      <div className="flex flex-col min-h-full justify-between p-8 lg:p-12 relative z-10">

        {/* Header */}
        <div className="text-center mt-8 lg:mt-16">
          <h1 className="text-4xl lg:text-6xl font-black leading-tight tracking-tight text-white">
            Build healthy
            <br />
            habits with us
          </h1>
          <p className="text-white/60 mt-4 text-base lg:text-lg max-w-md mx-auto">
            Track your daily routines, maintain streaks, and unlock your best self with Antigravite.
          </p>
        </div>

        {/* Center Area */}
        <div className="flex-1 flex items-center justify-center py-6">
          {!showForm ? (
            <div className="relative w-56 h-56 lg:w-72 lg:h-72">
              <img
                src="https://api.dicebear.com/7.x/shapes/svg?seed=Felix&backgroundColor=transparent"
                alt="Mascot"
                className="w-full h-full object-contain filter drop-shadow-2xl"
              />
              <div className="absolute -bottom-4 bg-accent-green/50 w-48 h-12 rounded-[100%] blur-md left-1/2 -translate-x-1/2"></div>
            </div>
          ) : (
            /* Login / Register Form */
            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-base"
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-base"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 text-base"
              />

              {error && (
                <p className="text-red-200 text-sm text-center bg-red-500/20 rounded-xl px-4 py-2">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-white text-text-dark rounded-2xl font-bold text-lg shadow-lg hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-60"
              >
                {loading ? 'Please wait...' : isLogin ? 'Log in' : 'Create account'}
              </button>

              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="w-full text-white/70 text-sm py-2 hover:text-white transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
              </button>
            </form>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex flex-col space-y-3 max-w-sm mx-auto w-full">
          {!showForm ? (
            <>
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 bg-white text-text-dark text-center rounded-2xl font-bold text-xl shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all active:scale-[0.98]"
              >
                Get started
              </button>
              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3 bg-white/10 border border-white/20 text-white text-center rounded-2xl font-semibold hover:bg-white/20 transition-all disabled:opacity-60"
              >
                {loading ? 'Logging in...' : '🚀 Try demo account'}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 bg-white/10 border border-white/20 text-white text-center rounded-2xl font-semibold hover:bg-white/20 transition-all disabled:opacity-60"
            >
              {loading ? 'Logging in...' : '🚀 Try demo account'}
            </button>
          )}

          <p className="text-center text-xs text-white/50 mt-2 px-4 leading-relaxed">
            By starting or signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-white/80">Terms of use</a>
          </p>
        </div>

      </div>

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-12 w-3 h-3 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute top-40 left-8 w-4 h-4 bg-yellow-400 rotate-45 animate-bounce"></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-accent-green rounded-full animate-ping"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-green/10 rounded-full blur-3xl"></div>
      </div>
    </AppShell>
  );
};

export default Onboarding;
