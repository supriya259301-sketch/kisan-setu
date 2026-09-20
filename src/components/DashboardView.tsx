import React from 'react';
import {
  Store,
  TrendingUp,
  Calculator,
  Truck,
  Users,
  BookOpen,
  User,
  Mic,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CloudSun,
  IndianRupee,
  Layers,
  Sparkles,
  Award,
  Lock,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { Farmer, MarketPrice, BuyerOffer } from '../types';

interface DashboardViewProps {
  farmer: Farmer | null;
  setActiveTab: (tab: string) => void;
  onOpenVoice: () => void;
  onOpenAuth: () => void;
  t: (key: string) => string;
  marketPrices: MarketPrice[];
  buyerOffers: BuyerOffer[];
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  farmer,
  setActiveTab,
  onOpenVoice,
  onOpenAuth,
  t,
  marketPrices,
  buyerOffers,
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const coreActions = [
    {
      id: 'buyers',
      title: t('buyers'),
      desc: 'Browse verified direct buyers, institutional buyers, and bulk millers.',
      icon: Store,
      badge: `${buyerOffers.length} Active Offers`,
      color: 'bg-emerald-600',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'prices',
      title: t('marketPrices'),
      desc: 'Compare daily wholesale mandi rates across major APMCs and grain markets.',
      icon: TrendingUp,
      badge: 'Live APMC Feed',
      color: 'bg-amber-600',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'calculator',
      title: t('calculator'),
      desc: 'Calculate your exact in-hand net amount after transport and mandi fees.',
      icon: Calculator,
      badge: 'Instant Formula',
      color: 'bg-blue-600',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'logistics',
      title: t('logistics'),
      desc: 'Connect with verified pickup and truck drivers for fair-rate transport.',
      icon: Truck,
      badge: 'Direct Drivers',
      color: 'bg-purple-600',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      id: 'shared',
      title: t('sharedTransport'),
      desc: 'Pool transport with neighboring farmers heading to the same mandi & save 45%.',
      icon: Users,
      badge: 'Save ₹800-₹2500',
      color: 'bg-teal-600',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      id: 'advisory',
      title: t('cropAdvisory'),
      desc: 'Seasonal sowing guides, agronomy recommendations, and MSP notifications.',
      icon: BookOpen,
      badge: 'Scientifically Vetted',
      color: 'bg-lime-700',
      tagColor: 'bg-lime-50 text-lime-800 border-lime-200',
    },
  ];

  const comingSoonFeatures = [
    {
      title: 'Farmer-to-Farmer Direct Connect',
      desc: 'Peer-to-peer equipment sharing, organic seed exchange, and farmer group messaging.',
      icon: Users,
    },
    {
      title: 'Cold Storage Matching',
      desc: 'Reserve space in nearby climate-controlled cold storages for perishable crops.',
      icon: Layers,
    },
    {
      title: 'Market-Demand Analytics',
      desc: 'AI-driven 30-day price trend forecasts and crop demand projections before sowing.',
      icon: Sparkles,
    },
    {
      title: 'Direct Digital Payments',
      desc: 'Escrow-backed guaranteed instant payments straight to Jan Dhan / bank accounts.',
      icon: Lock,
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Farmer Welcome & Agri-Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative grain patterns */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-300">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentDate}</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-amber-300">
                <CloudSun className="w-3.5 h-3.5" />
                <span>28°C Clear Sky (Optimal for Harvesting)</span>
              </span>
            </div>

            <h1 id="dashboard-welcome-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif text-white">
              Welcome, {farmer?.name || 'Farmer'}
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              {farmer ? (
                <>
                  Registered at <span className="font-bold text-white">{farmer.village}, {farmer.district} ({farmer.state})</span>.
                  Compare current mandi rates, find verified buyers with high payment guarantees, and save on transport today.
                </>
              ) : (
                'Empowering Indian farmers with transparent mandi prices, direct institutional buyer offers, and collective transport pooling.'
              )}
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenVoice}
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-stone-900 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Mic className="w-4 h-4" />
                <span>Tap to Speak (Voice Search)</span>
              </button>
              {!farmer && (
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center space-x-1.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  <span>Farmer Sign In / Register</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Stat Pill Card */}
          <div className="bg-emerald-950/70 border border-emerald-700/50 rounded-xl p-4 sm:p-5 flex flex-col justify-center space-y-3 shrink-0 sm:w-64">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Today's Key Market Signal
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                ₹2,510 <span className="text-xs font-sans text-emerald-200">/ Qtl</span>
              </div>
              <div className="text-xs text-emerald-100 font-medium">
                Top Wheat Buyer Offer (Adani Agri)
              </div>
            </div>
            <div className="text-[11px] text-emerald-300 flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>₹235 above Govt MSP (₹2,275)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setActiveTab('buyers')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-emerald-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('activeBuyers')}
            </span>
            <Store className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            {buyerOffers.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Verified procurement hubs
          </span>
        </div>

        <div
          onClick={() => setActiveTab('prices')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-amber-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('avgMandiPrice')}
            </span>
            <TrendingUp className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            ₹2,480
          </div>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center mt-1">
            Across 5 major APMCs
          </span>
        </div>

        <div
          onClick={() => setActiveTab('logistics')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-purple-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('logisticsAvailable')}
            </span>
            <Truck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            18 Vehicles
          </div>
          <span className="text-[11px] text-purple-700 font-semibold flex items-center mt-1">
            Pickups & mini trucks ready
          </span>
        </div>

        <div
          onClick={() => setActiveTab('shared')}
          className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs hover:border-teal-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {t('activeSharedTrips')}
            </span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-stone-900 font-mono">
            2 Open Trips
          </div>
          <span className="text-[11px] text-teal-700 font-semibold flex items-center mt-1">
            Save up to 45% on transport
          </span>
        </div>
      </div>

      {/* Live Daily Mandi Price Ticker */}
      <div className="bg-stone-100/80 border border-stone-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Daily Mandi Modal Rates (APMC Benchmark)
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('prices')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Mandi Comparisons</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {marketPrices.slice(0, 5).map((mp) => (
            <div
              key={mp.id}
              className="bg-white border border-stone-200 rounded-lg p-3 shadow-2xs hover:shadow-xs transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">{mp.crop_name}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    mp.trend === 'up'
                      ? 'bg-emerald-100 text-emerald-800'
                      : mp.trend === 'down'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {mp.trend === 'up' ? '▲ UP' : mp.trend === 'down' ? '▼ DOWN' : '● STEADY'}
                </span>
              </div>
              <div className="text-lg font-black text-stone-900 font-mono mt-1">
                ₹{mp.modal_price.toLocaleString('en-IN')}
                <span className="text-[10px] font-normal text-stone-500"> / Qtl</span>
              </div>
              <div className="text-[11px] text-stone-500 truncate mt-0.5">
                {mp.mandi_name.split(' ')[0]} Mandi
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Core Platform Modules Hub */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 font-serif">
              Core Farmer Services
            </h2>
            <p className="text-xs text-stone-500">
              Select any tool below to begin your selling and transportation journey
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coreActions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.id}
                id={`card-${action.id}`}
                onClick={() => setActiveTab(action.id)}
                className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${action.color} text-white flex items-center justify-center shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${action.tagColor}`}>
                      {action.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition">
                    {action.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {action.desc}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 19: Coming Soon Features */}
      <div className="pt-4">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <h2 className="text-lg font-bold text-stone-900 font-serif">
            {t('futureFeatures')}
          </h2>
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t('comingSoon')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {comingSoonFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-stone-50/70 border border-dashed border-stone-300 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-stone-200 text-stone-600 flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-stone-800">{feat.title}</h4>
                  <p className="text-[11px] text-stone-500 mt-1 leading-normal">
                    {feat.desc}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-200/60">
                  <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                    In Development • Coming Soon
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
