import React, { useState } from 'react';
import {
  Sprout,
  Store,
  TrendingUp,
  Calculator,
  Truck,
  Users,
  BookOpen,
  User,
  Mic,
  Languages,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import { Farmer } from '../types';
import { LANGUAGES } from '../translations';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  farmer: Farmer | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenVoice: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  setLanguage,
  t,
  farmer,
  onOpenAuth,
  onLogout,
  onOpenVoice,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: t('dashboard'), icon: Sprout },
    { id: 'buyers', label: t('buyers'), icon: Store },
    { id: 'prices', label: t('marketPrices'), icon: TrendingUp },
    { id: 'calculator', label: t('calculator'), icon: Calculator },
    { id: 'logistics', label: t('logistics'), icon: Truck },
    { id: 'shared', label: t('sharedTransport'), icon: Users },
    { id: 'advisory', label: t('cropAdvisory'), icon: BookOpen },
    { id: 'profile', label: t('profile'), icon: User },
  ];

  const currentLangObj = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner / Utility Bar */}
      <div className="bg-emerald-800 text-emerald-50 px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Direct Mandi & Fair Transport Network</span>
            <span className="hidden sm:inline text-emerald-200">• Direct Buyer Connectivity & Zero Middlemen Exploitation</span>
          </div>
          <div className="flex items-center space-x-3 text-emerald-100">
            <button
              onClick={onOpenVoice}
              className="flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-700/70 hover:bg-emerald-700 transition cursor-pointer font-medium"
              title="Browser Voice Assistant"
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" />
              <span>{t('voiceAssistant')}</span>
            </button>
            <span className="text-emerald-400">|</span>
            {farmer ? (
              <span className="font-semibold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                {farmer.name} ({farmer.village})
              </span>
            ) : (
              <button
                onClick={onOpenAuth}
                className="hover:text-white underline cursor-pointer"
              >
                {t('login')} / {t('register')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between min-h-[4.25rem] sm:min-h-[4.5rem] py-2.5 gap-3 sm:gap-6">
          {/* Logo & Branding Area - visually contained and properly spaced */}
          <div className="shrink-0 max-w-[200px] sm:max-w-xs md:max-w-sm">
            <BrandLogo
              appName={t('appName')}
              appTagline={t('appTagline')}
              badgeText="Krishi Setu"
              layout="horizontal"
              size="md"
              onClick={() => setActiveTab('dashboard')}
            />
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs'
                      : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Language Selector, Voice, Farmer Auth */}
          <div className="flex items-center space-x-2">
            {/* Language Dropdown */}
            <div className="relative">
              <button
                id="btn-language-selector"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-stone-50 hover:bg-white text-stone-700 text-sm font-semibold transition cursor-pointer"
              >
                <Languages className="w-4 h-4 text-emerald-600" />
                <span>{currentLangObj.native}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
              </button>

              {langDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setLangDropdownOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-stone-100 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Select Language / भाषा चुनें
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-emerald-50 transition cursor-pointer ${
                          currentLanguage === lang.code ? 'bg-emerald-50/80 font-bold text-emerald-800' : 'text-stone-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <span className="font-medium">{lang.native}</span>
                          <span className="text-xs text-stone-400">({lang.name})</span>
                        </span>
                        {currentLanguage === lang.code && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Voice Input Quick Button */}
            <button
              id="btn-voice-input"
              onClick={onOpenVoice}
              className="p-2 rounded-lg border border-stone-300 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-stone-700 transition cursor-pointer"
              title="Speak to Search (Web Speech API)"
            >
              <Mic className="w-4 h-4 text-amber-600" />
            </button>

            {/* Farmer Profile / Logout */}
            {farmer ? (
              <div className="hidden sm:flex items-center space-x-1 pl-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition cursor-pointer"
                  title="Farmer Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    {farmer.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold text-stone-800 hidden md:inline">
                    {farmer.name.split(' ')[0]}
                  </span>
                </button>
                <button
                  id="btn-logout"
                  onClick={onLogout}
                  className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                  title={t('logout')}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-login-header"
                onClick={onOpenAuth}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-xs cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{t('login')}</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-150">
          <div className="pb-3 border-b border-stone-100">
            <BrandLogo
              appName={t('appName')}
              appTagline={t('appTagline')}
              badgeText="Krishi Setu"
              layout="horizontal"
              size="sm"
              onClick={() => {
                setActiveTab('dashboard');
                setMobileMenuOpen(false);
              }}
            />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-stone-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100">
            {farmer ? (
              <div className="flex items-center justify-between w-full p-2 bg-stone-50 rounded-xl">
                <div className="min-w-0 flex-1 pr-2">
                  <p className="text-xs font-bold text-stone-900 truncate">{farmer.name}</p>
                  <p className="text-[11px] text-stone-500 truncate">{farmer.village}, {farmer.district}</p>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="shrink-0 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-xs"
              >
                {t('login')} / {t('register')}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
