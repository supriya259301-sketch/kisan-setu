import React, { useState } from 'react';
import {
  Sprout,
  Lock,
  Phone,
  Mail,
  MapPin,
  Globe,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Languages,
  ChevronDown
} from 'lucide-react';
import { Farmer } from '../types';
import { LANGUAGES } from '../translations';
import { ApiService } from '../services/apiService';
import { BrandLogo } from './BrandLogo';

interface RegisterPageProps {
  onRegisterSuccess: (farmer: Farmer) => void;
  onNavigateToLogin: () => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const INDIAN_STATES = [
  'Punjab',
  'Haryana',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Maharashtra',
  'Rajasthan',
  'Gujarat',
  'Bihar',
  'West Bengal',
  'Karnataka',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Telangana',
  'Odisha',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh'
];

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onRegisterSuccess,
  onNavigateToLogin,
  currentLanguage,
  setLanguage,
  t,
}) => {
  // Form fields mandated by user
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [state, setState] = useState('Punjab');
  const [preferredLang, setPreferredLang] = useState(currentLanguage || 'en');
  const [farmSize, setFarmSize] = useState('4.5');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentLangObj = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Strict validation
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!mobile.trim() || mobile.trim().length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (!village.trim()) {
      setError('Please enter your village name.');
      return;
    }
    if (!district.trim()) {
      setError('Please enter your district.');
      return;
    }
    if (!state.trim()) {
      setError('Please select your state.');
      return;
    }

    setLoading(true);

    try {
      const result = await ApiService.register({
        name: name.trim(),
        mobile: mobile.trim(),
        email: email.trim() || `${mobile.trim()}@farmer.kisansetu.in`,
        password: password.trim(),
        village: village.trim(),
        district: district.trim(),
        state: state.trim(),
        language: preferredLang,
        farm_size_acres: parseFloat(farmSize) || 4.0
      });

      if (result.success && result.farmer) {
        // Change app language to preferred language if selected
        if (preferredLang) {
          setLanguage(preferredLang);
        }
        onRegisterSuccess(result.farmer);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Top bar with language switcher */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1.5 text-xs text-stone-500 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>New Farmer Registration</span>
        </div>

        {/* Regional Language Switcher */}
        <div className="relative">
          <button
            id="register-lang-select"
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
                    setPreferredLang(lang.code);
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

      {/* Main Registration Card */}
      <div className="max-w-xl w-full mx-auto bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
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

        {/* Section Heading */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold text-stone-900 font-serif">
            Join Kisan Setu Platform
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Register your farmer profile for direct market connectivity & shared transport.
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div
            id="register-error-alert"
            className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-start space-x-2.5 animate-in fade-in duration-200"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{error}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="reg-name"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Supriya Yadav"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label
                htmlFor="reg-mobile"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Mobile Number *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="reg-mobile"
                  type="tel"
                  required
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="10-digit mobile"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Email Address (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. supriya@example.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="sm:col-span-2">
              <label
                htmlFor="reg-password"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Create Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
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

            {/* Village */}
            <div>
              <label
                htmlFor="reg-village"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Village / Gram *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <input
                  id="reg-village"
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Rampur"
                  className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                />
              </div>
            </div>

            {/* District */}
            <div>
              <label
                htmlFor="reg-district"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                District *
              </label>
              <input
                id="reg-district"
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Meerut"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              />
            </div>

            {/* State */}
            <div>
              <label
                htmlFor="reg-state"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                State *
              </label>
              <select
                id="reg-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Preferred Language */}
            <div>
              <label
                htmlFor="reg-language"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Preferred Language *
              </label>
              <select
                id="reg-language"
                value={preferredLang}
                onChange={(e) => {
                  setPreferredLang(e.target.value);
                  setLanguage(e.target.value);
                }}
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition font-medium"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.native} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Farm Landholding Size */}
            <div className="sm:col-span-2">
              <label
                htmlFor="reg-farm-size"
                className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1"
              >
                Cultivated Landholding (Acres)
              </label>
              <input
                id="reg-farm-size"
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                value={farmSize}
                onChange={(e) => setFarmSize(e.target.value)}
                placeholder="e.g. 5.0"
                className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="btn-register-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-sm shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Farmer Account...</span>
              </>
            ) : (
              <>
                <span>Create Account / Register</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Login Navigation Link */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-600">
            Already have an account?{' '}
            <button
              id="link-go-to-login"
              type="button"
              onClick={onNavigateToLogin}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline cursor-pointer ml-1"
            >
              Login
            </button>
          </p>
        </div>
      </div>

      <div className="max-w-xl w-full mx-auto mt-6 text-center text-xs text-stone-400">
        <span>© 2026 Kisan Setu • Transparent Indian Agri Network</span>
      </div>
    </div>
  );
};
