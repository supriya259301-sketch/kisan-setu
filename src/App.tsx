/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Store,
  TrendingUp,
  Calculator,
  Truck,
  Users,
  BookOpen,
  User,
  PhoneCall,
  ShieldCheck,
  Heart,
  Globe,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { BuyersView } from './components/BuyersView';
import { MarketPricesView } from './components/MarketPricesView';
import { CalculatorView } from './components/CalculatorView';
import { LogisticsView } from './components/LogisticsView';
import { SharedTransportView } from './components/SharedTransportView';
import { CropAdvisoryView } from './components/CropAdvisoryView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { BrandLogo } from './components/BrandLogo';
import { ApiService } from './services/apiService';
import { TRANSLATIONS, LANGUAGES } from './translations';
import {
  Farmer,
  Crop,
  Mandi,
  MarketPrice,
  BuyerOffer,
  TransportProvider,
  SharedTransport,
  CropAdvisoryItem
} from './types';
import {
  INITIAL_CROPS,
  INITIAL_MANDIS,
  INITIAL_ADVISORY
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [farmer, setFarmer] = useState<Farmer | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);

  // Data collections
  const [crops, setCrops] = useState<Crop[]>(INITIAL_CROPS);
  const [mandis, setMandis] = useState<Mandi[]>(INITIAL_MANDIS);
  const [buyerOffers, setBuyerOffers] = useState<BuyerOffer[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [transporters, setTransporters] = useState<TransportProvider[]>([]);
  const [sharedTrips, setSharedTrips] = useState<SharedTransport[]>([]);
  const [advisories, setAdvisories] = useState<CropAdvisoryItem[]>(INITIAL_ADVISORY);

  // Calculator deep link values
  const [calculatorInitialValues, setCalculatorInitialValues] = useState<{
    crop?: string;
    price?: number;
    distance?: number;
  }>({ crop: 'Wheat', price: 2480, distance: 25 });

  // Translation helper
  const t = (key: string): string => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS['en'];
    return langDict[key] || TRANSLATIONS['en']?.[key] || key;
  };

  // Check auth and load collections
  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const activeFarmer = await ApiService.checkMe();
      if (activeFarmer) {
        setFarmer(activeFarmer);
        if (activeFarmer.language) {
          setCurrentLanguage(activeFarmer.language);
        }
      } else {
        setFarmer(null);
      }
    } catch (err) {
      console.error('Auth verification error:', err);
      setFarmer(null);
    } finally {
      setIsCheckingAuth(false);
    }
    loadDataCollections();
  };

  const loadDataCollections = async () => {
    try {
      const [offers, prices, logistics, trips, cropAdv] = await Promise.all([
        ApiService.getBuyerOffers(),
        ApiService.getMarketPrices(),
        ApiService.getLogistics(),
        ApiService.getSharedTrips(),
        ApiService.getCropAdvisory()
      ]);

      setBuyerOffers(offers);
      setMarketPrices(prices);
      setTransporters(logistics);
      setSharedTrips(trips);
      setAdvisories(cropAdv);
    } catch (err) {
      console.error('Data collections load error:', err);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    if (farmer) {
      const updated = { ...farmer, language: lang };
      setFarmer(updated);
      ApiService.updateProfile({ language: lang }).catch(() => {});
    }
  };

  const handleLogout = async () => {
    try {
      await ApiService.logout();
    } catch {
      // Ignored
    }
    setFarmer(null);
    setAuthView('login');
    setActiveTab('dashboard');
  };

  const handleVoiceResult = (text: string, intent?: { action: string; value: string }) => {
    if (intent) {
      if (intent.action === 'navigate') {
        setActiveTab(intent.value);
      } else if (intent.action === 'filter_crop') {
        setCalculatorInitialValues({ crop: intent.value, price: 2480, distance: 25 });
        setActiveTab('buyers');
      }
    }
  };

  const handleSelectForCalculator = (cropName: string, price: number, distance: number) => {
    setCalculatorInitialValues({ crop: cropName, price, distance });
    setActiveTab('calculator');
  };

  // 1. Loading screen while verifying authentication status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white animate-pulse">
            <Sprout className="w-7 h-7" />
          </div>
          <p className="text-sm font-semibold text-stone-700">Connecting to Kisan Setu...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated state: User Open -> Login or Register page
  if (!farmer) {
    if (authView === 'register') {
      return (
        <RegisterPage
          onRegisterSuccess={(newFarmer) => {
            setFarmer(newFarmer);
            setActiveTab('dashboard');
            loadDataCollections();
          }}
          onNavigateToLogin={() => setAuthView('login')}
          currentLanguage={currentLanguage}
          setLanguage={handleLanguageChange}
          t={t}
        />
      );
    }

    return (
      <LoginPage
        onLoginSuccess={(loggedFarmer) => {
          setFarmer(loggedFarmer);
          setActiveTab('dashboard');
          loadDataCollections();
        }}
        onNavigateToRegister={() => setAuthView('register')}
        currentLanguage={currentLanguage}
        setLanguage={handleLanguageChange}
        t={t}
      />
    );
  }

  // 3. Authenticated state: Protected Dashboard & All Farmer Views
  return (
    <div className="min-h-screen bg-stone-50/60 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Main Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLanguage={currentLanguage}
        setLanguage={handleLanguageChange}
        t={t}
        farmer={farmer}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenVoice={() => setVoiceModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            farmer={farmer}
            setActiveTab={setActiveTab}
            onOpenVoice={() => setVoiceModalOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            t={t}
            marketPrices={marketPrices}
            buyerOffers={buyerOffers}
          />
        )}

        {activeTab === 'buyers' && (
          <BuyersView
            offers={buyerOffers}
            crops={crops}
            t={t}
            onOpenVoice={() => setVoiceModalOpen(true)}
            onSelectForCalculator={handleSelectForCalculator}
          />
        )}

        {activeTab === 'prices' && (
          <MarketPricesView
            prices={marketPrices}
            mandis={mandis}
            crops={crops}
            t={t}
            onOpenVoice={() => setVoiceModalOpen(true)}
            onSelectForCalculator={handleSelectForCalculator}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorView
            crops={crops}
            t={t}
            initialValues={calculatorInitialValues}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsView
            providers={transporters}
            t={t}
            onOpenVoice={() => setVoiceModalOpen(true)}
          />
        )}

        {activeTab === 'shared' && (
          <SharedTransportView
            trips={sharedTrips}
            farmer={farmer}
            t={t}
            onTripUpdated={loadDataCollections}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}

        {activeTab === 'advisory' && (
          <CropAdvisoryView
            advisories={advisories}
            t={t}
            onOpenVoice={() => setVoiceModalOpen(true)}
            onNavigateToPrices={(crop) => {
              setActiveTab('prices');
            }}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            farmer={farmer}
            t={t}
            onFarmerUpdated={(updated) => setFarmer(updated)}
            onLogout={handleLogout}
            onOpenAuth={() => setAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand column */}
            <div className="space-y-3 md:col-span-1">
              <BrandLogo
                appName={t('appName')}
                appTagline={t('appTagline')}
                badgeText="Krishi Setu"
                layout="horizontal"
                theme="dark"
                size="sm"
                onClick={() => setActiveTab('dashboard')}
              />
              <p className="text-xs text-stone-400 leading-relaxed pt-1">
                Empowering Indian farmers through transparent market discovery, direct buyer procurement, and collective freight logistics.
              </p>
              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Brokerage • Direct Bank Settlement</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Core Modules
              </h4>
              <ul className="space-y-2 text-xs text-stone-400">
                <li>
                  <button onClick={() => setActiveTab('buyers')} className="hover:text-white cursor-pointer">
                    Direct Buyer Offers
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('prices')} className="hover:text-white cursor-pointer">
                    Daily APMC Mandi Rates
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('calculator')} className="hover:text-white cursor-pointer">
                    Net Amount Calculator
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('shared')} className="hover:text-white cursor-pointer">
                    F2F Shared Transport Pooling
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('advisory')} className="hover:text-white cursor-pointer">
                    Agronomy & MSP Advisory
                  </button>
                </li>
              </ul>
            </div>

            {/* Farmer Helpline */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                National Farmer Helpline
              </h4>
              <div className="space-y-2 text-xs text-stone-400">
                <div className="flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="font-mono text-white font-bold">1800-180-1551 (Toll Free)</span>
                </div>
                <p className="text-[11px] text-stone-400">
                  Government Kisan Call Center operational 24/7 across all regional Indian languages.
                </p>
                <div className="pt-2 text-[11px] text-stone-400">
                  APMC Market Network: Khanna, Azadpur, Indore, Vashi, Karnal.
                </div>
              </div>
            </div>

            {/* Language Quick Picks */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
                Supported Indian Languages
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => handleLanguageChange(l.code)}
                    className={`text-[11px] px-2 py-1 rounded transition cursor-pointer ${
                      currentLanguage === l.code
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700'
                    }`}
                  >
                    {l.native}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom attribution */}
          <div className="border-t border-stone-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-2">
            <div>
              © 2026 Kisan Setu (किसान सेतु) – Farmer Market & Logistics Platform.
            </div>
            <div className="flex items-center space-x-1 text-stone-400">
              <span>Dedicated to the Annadata (अन्नदाता) of India</span>
              <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            </div>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedFarmer) => {
          setFarmer(loggedFarmer);
          if (loggedFarmer.language) {
            setCurrentLanguage(loggedFarmer.language);
          }
        }}
        t={t}
      />

      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onVoiceResult={handleVoiceResult}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}
