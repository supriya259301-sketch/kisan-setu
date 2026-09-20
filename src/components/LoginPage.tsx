import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Phone,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Languages,
  ChevronDown
} from 'lucide-react';
import { Farmer } from '../types';
import { LANGUAGES } from '../translations';
import { ApiService } from '../services/apiService';
import { BrandLogo } from './BrandLogo';

interface LoginPageProps {
  onLoginSuccess: (farmer: Farmer) => void;
  onNavigateToRegister: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigateToRegister,
  currentLanguage,
  setLanguage,
  t,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setError('Invalid email/mobile or password.');
      return;
    }

    setLoading(true);

    try {
      const result = await ApiService.login(cleanId, cleanPass);
      if (result.success && result.farmer) {
        onLoginSuccess(result.farmer);
      } else {
        // As mandated by user: "If credentials are incorrect, show: Invalid email/mobile or password."
        setError(result.message || 'Invalid email/mobile or password.');
      }
    } catch (err: any) {
      setError(err?.message || 'Invalid email/mobile or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setIdentifier('9876543210');
    setPassword('kisan123');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top bar with language switcher */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Mandi & Logistics Portal</span>
        </div>

        {/* Regional Language Switcher */}
        <div className="relative">
          <button
            id="login-lang-select"
            type="button"
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-stone-300 bg-white text-stone-700 text-xs font-semibold hover:border-emerald-500 transition cursor-pointer shadow-2xs"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLangObj.native}</span>
            <ChevronDown className="w-3 h-3 text-stone-400" />
          </button>

          {langDropdownOpen && (
            <div
              className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-56 overflow-y-auto"
              onMouseLeave={() => setLangDropdownOpen(false)}
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-emerald-50 cursor-pointer ${
                    currentLanguage === lang.code ? 'bg-emerald-50 font-bold text-emerald-800' : 'text-stone-700'
                  }`}
                >
                  <span>{lang.native}</span>
                  {currentLanguage === lang.code && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
        {/* Dedicated Kisan Setu Branding Container - Visually grouped and contained */}
        <BrandLogo
          appName={t('appName')}
          appTagline={t('appTagline')}
          badgeText="Krishi Setu"
          layout="vertical"
          theme="card"
          size="lg"
          className="mb-6"
        />

        {/* Form Welcome Header */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-stone-900 font-serif">
            Welcome to Kisan Setu
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Login to continue to your farmer dashboard.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            id="login-error-alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2.5 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Forgot Password Notification Modal / Box */}
        {showForgotPassword && (
          <div className="mb-5 p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between font-bold text-amber-950">
              <span className="flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                Password Recovery Support
              </span>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              If you forgot your password, please contact the National Kisan Call Center helpline at{' '}
              <strong className="text-stone-900 font-mono">1800-180-1551</strong> (Toll-Free, 24/7) with your registered mobile number, or use the quick test credentials below.
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Mobile / Email Field */}
          <div>
            <label
              htmlFor="login-mobile-or-email"
              className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5"
            >
              Mobile Number / Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Phone className="w-4 h-4" />
              </div>
              <input
                id="login-mobile-or-email"
                type="text"
                autoComplete="username"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter 10-digit mobile number or email"
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider"
              >
                Password
              </label>
              <button
                type="button"
                id="btn-forgot-password"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your account password"
                className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-login-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Login to Farmer Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Navigation link */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            Don't have an account?{' '}
            <button
              id="link-go-to-register"
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
            >
              Register as New Farmer
            </button>
          </p>
        </div>

        {/* Quick Demo Assist */}
        <div className="mt-5 p-3 bg-stone-50 border border-stone-200 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              Quick Test Credentials
            </span>
            <button
              type="button"
              id="btn-autofill-demo"
              onClick={handleDemoFill}
              className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              Auto-fill Demo
            </button>
          </div>
          <div className="mt-1 text-[11px] text-stone-600 space-y-0.5 font-mono">
            <div>Mobile: <span className="font-semibold text-stone-800">9876543210</span></div>
            <div>Password: <span className="font-semibold text-stone-800">kisan123</span></div>
          </div>
        </div>
      </div>

      {/* Footer reassurance */}
      <div className="max-w-md w-full mx-auto mt-6 text-center text-xs text-stone-400">
        <span>© 2026 Kisan Setu • Built for Indian Agriculture • Zero Commission</span>
      </div>
    </div>
  );
};
