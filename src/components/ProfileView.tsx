import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Globe,
  CheckCircle2,
  Edit2,
  Save,
  ShieldCheck,
  LogOut,
  Calendar,
  Layers,
  Sprout
} from 'lucide-react';
import { Farmer } from '../types';
import { LANGUAGES } from '../translations';
import { ApiService } from '../services/apiService';

interface ProfileViewProps {
  farmer: Farmer | null;
  t: (key: string) => string;
  onFarmerUpdated: (farmer: Farmer) => void;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  farmer,
  t,
  onFarmerUpdated,
  onLogout,
  onOpenAuth,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State
  const [name, setName] = useState(farmer?.name || '');
  const [mobile, setMobile] = useState(farmer?.mobile || '');
  const [email, setEmail] = useState(farmer?.email || '');
  const [village, setVillage] = useState(farmer?.village || '');
  const [district, setDistrict] = useState(farmer?.district || '');
  const [state, setState] = useState(farmer?.state || '');
  const [language, setLanguage] = useState(farmer?.language || 'en');
  const [farmSize, setFarmSize] = useState(farmer?.farm_size_acres?.toString() || '5.0');

  useEffect(() => {
    if (farmer) {
      setName(farmer.name || '');
      setMobile(farmer.mobile || '');
      setEmail(farmer.email || '');
      setVillage(farmer.village || '');
      setDistrict(farmer.district || '');
      setState(farmer.state || '');
      setLanguage(farmer.language || 'en');
      setFarmSize(farmer.farm_size_acres ? farmer.farm_size_acres.toString() : '5.0');
    }
  }, [farmer]);

  if (!farmer) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
        <User className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-stone-900 font-serif">
          Farmer Account Login Required
        </h2>
        <p className="text-xs text-stone-500 mt-1 mb-6">
          Sign in or register to access your profile details, manage shared transport bookings, and track direct buyer inquiries.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold transition shadow-xs cursor-pointer"
        >
          Sign In to Kisan Setu
        </button>
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await ApiService.updateProfile({
        name,
        mobile,
        email,
        village,
        district,
        state,
        language,
        farm_size_acres: parseFloat(farmSize) || 5.0,
      });
      onFarmerUpdated(updated);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {t('profile')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage your verified agricultural credentials and village location.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5 text-stone-600" />
              <span>{t('editProfile')}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-stone-500 hover:text-stone-800 text-xs font-bold"
            >
              Cancel
            </button>
          )}

          <button
            onClick={onLogout}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile updated successfully! Changes saved to your account.</span>
        </div>
      )}

      {/* Main Profile Info Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-start justify-between border-b border-stone-100 pb-5 mb-5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-sm">
              {farmer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-stone-900">{farmer.name}</h2>
                <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 mr-0.5 text-emerald-600" />
                  Verified Farmer
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {farmer.village}, {farmer.district}, {farmer.state} • Cultivating {farmer.farm_size_acres || 8.5} Acres
              </p>
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Farmer Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Mobile Number (Primary)
                </label>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Landholding Size (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Village
                </label>
                <input
                  type="text"
                  required
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  District
                </label>
                <input
                  type="text"
                  required
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Preferred Platform Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Changes...' : t('saveChanges')}</span>
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Mobile Number
              </span>
              <span className="text-sm font-bold text-stone-900 font-mono mt-0.5 flex items-center">
                <Phone className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                {farmer.mobile}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Email
              </span>
              <span className="text-sm font-semibold text-stone-900 mt-0.5 flex items-center truncate">
                <Mail className="w-3.5 h-3.5 mr-1.5 text-stone-400 shrink-0" />
                {farmer.email || 'Not provided'}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Cultivated Landholding
              </span>
              <span className="text-sm font-bold text-stone-900 font-mono mt-0.5 flex items-center">
                <Sprout className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                {farmer.farm_size_acres || 8.5} Acres
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Village & District
              </span>
              <span className="text-sm font-semibold text-stone-900 mt-0.5 flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                {farmer.village}, {farmer.district}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                State & Region
              </span>
              <span className="text-sm font-semibold text-stone-900 mt-0.5 flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                {farmer.state}
              </span>
            </div>

            <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                Preferred Interface Language
              </span>
              <span className="text-sm font-semibold text-stone-900 mt-0.5 flex items-center">
                {LANGUAGES.find((l) => l.code === farmer.language)?.native || 'English'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Kisan Setu Verified Farmer Perks */}
      <div className="bg-stone-100/80 border border-stone-200 rounded-2xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
          Your Active Benefits on Kisan Setu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-white p-3 rounded-xl border border-stone-200/70">
            <span className="font-bold text-stone-800 block mb-1">Direct Buyer Access</span>
            <p className="text-stone-500 text-[11px]">
              Zero brokerage fee on direct institutional crop transactions.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200/70">
            <span className="font-bold text-stone-800 block mb-1">F2F Transport Pooling</span>
            <p className="text-stone-500 text-[11px]">
              Priority listing for shared truck dispatches to local APMCs.
            </p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-stone-200/70">
            <span className="font-bold text-stone-800 block mb-1">Agronomy Advisory</span>
            <p className="text-stone-500 text-[11px]">
              SMS & in-app alerts on MSP revisions and pest outbreaks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
