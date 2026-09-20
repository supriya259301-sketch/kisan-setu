import React, { useState } from 'react';
import { X, Lock, Phone, Mail, MapPin, Globe, User, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Farmer } from '../types';
import { LANGUAGES } from '../translations';
import { ApiService } from '../services/apiService';
import { BrandLogo } from './BrandLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (farmer: Farmer) => void;
  t: (key: string) => string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  t,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state (Mandated 8 fields)
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Punjab');
  const [language, setLanguage] = useState('en');
  const [farmSize, setFarmSize] = useState('5.0');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await ApiService.login(loginIdentifier, loginPassword);
      if (result.success && result.farmer) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onLoginSuccess(result.farmer!);
          onClose();
        }, 600);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim() || !mobile.trim() || !password.trim() || !village.trim() || !district.trim() || !state.trim()) {
      setError('Please fill in all mandatory fields (Name, Mobile, Password, Village, District, State)');
      return;
    }

    if (mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const result = await ApiService.register({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        language,
        farm_size_acres: parseFloat(farmSize) || 4.0
      });

      if (result.success && result.farmer) {
        setSuccessMsg(result.message);
        setTimeout(() => {
          onLoginSuccess(result.farmer!);
          onClose();
        }, 800);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoMobile: string) => {
    setLoading(true);
    const res = await ApiService.login(demoMobile, 'kisan123');
    if (res.success && res.farmer) {
      onLoginSuccess(res.farmer);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Container - Visually grouped inside dedicated card */}
        <div className="mb-4 pt-1">
          <BrandLogo
            appName={t('appName')}
            appTagline={t('appTagline')}
            badgeText="Krishi Setu"
            layout="vertical"
            theme="card"
            size="sm"
          />
        </div>

        {/* Modal Section Header */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-stone-900 font-serif">
            {mode === 'login' ? 'Farmer Login' : 'Farmer Registration'}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {mode === 'login'
              ? 'Access your mandi prices, direct buyer deals, and transport network'
              : 'Join thousands of verified farmers on the Kisan Setu platform'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg bg-stone-100 p-1 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              mode === 'login' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {t('login')}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition cursor-pointer ${
              mode === 'register' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('enterPassword')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Logging in...' : t('login')}
            </button>

            {/* Fast 1-Click Demo Profiles */}
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 text-center">
                Quick Demo Farmer Logins:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('9876543210')}
                  className="p-2 border border-stone-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition cursor-pointer"
                >
                  <span className="block text-xs font-bold text-stone-800">Demo Farmer</span>
                  <span className="block text-[10px] text-stone-500">Ludhiana, Punjab (Wheat)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('9811223344')}
                  className="p-2 border border-stone-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition cursor-pointer"
                >
                  <span className="block text-xs font-bold text-stone-800">Suresh Patil</span>
                  <span className="block text-[10px] text-stone-500">Nashik, MH (Onion)</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Registration Form - Section 1 fields */
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('farmerName')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Gurpreet Singh"
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('mobileNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="9876543210"
                  className="w-full px-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('email')}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@kisan.in"
                  className="w-full px-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('enterPassword')} *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create secure password"
                className="w-full px-3 py-1.5 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('village')} *
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village"
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('district')} *
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('state')} *
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  {t('preferredLanguage')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Farm Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-sm shadow-xs transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Complete Farmer Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
