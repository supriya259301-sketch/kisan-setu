import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Calendar,
  TrendingUp,
  Droplets,
  Bug,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Mic,
  Award
} from 'lucide-react';
import { CropAdvisoryItem } from '../types';

interface CropAdvisoryViewProps {
  advisories: CropAdvisoryItem[];
  t: (key: string) => string;
  onOpenVoice: () => void;
  onNavigateToPrices: (cropName: string) => void;
}

export const CropAdvisoryView: React.FC<CropAdvisoryViewProps> = ({
  advisories,
  t,
  onOpenVoice,
  onNavigateToPrices,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [seasonFilter, setSeasonFilter] = useState('all');

  const filteredItems = useMemo(() => {
    return advisories.filter((item) => {
      const matchesSearch =
        item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.hindi_name && item.hindi_name.includes(searchQuery)) ||
        (item.crop_info && item.crop_info.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSeason =
        seasonFilter === 'all' || item.season.toLowerCase() === seasonFilter.toLowerCase();

      return matchesSearch && matchesSeason;
    });
  }, [advisories, searchQuery, seasonFilter]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {t('cropAdvisory')}
          </h1>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Agronomy & MSP Insights
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Scientifically vetted sowing schedules, irrigation stages, pest management protocols, and official MSP notifications.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop, variety, disease or pest..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={onOpenVoice}
              className="absolute right-2 top-2 p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>

          {/* Season Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
              Season:
            </span>
            {['all', 'Rabi', 'Kharif'].map((s) => (
              <button
                key={s}
                onClick={() => setSeasonFilter(s)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer capitalize whitespace-nowrap ${
                  seasonFilter === s
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {s === 'all' ? 'All Seasons' : `${s} Crop`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Card Title & Badges */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-bold text-stone-900">
                      {item.crop}
                    </h3>
                    {item.hindi_name && (
                      <span className="text-xs font-medium text-stone-500">
                        ({item.hindi_name})
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-700">
                    {item.season} Season Crop
                  </span>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.market_demand.includes('Very High')
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Demand: {item.market_demand}
                  </span>
                  {item.standard_msp && (
                    <span className="text-xs font-mono font-extrabold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      Govt MSP: ₹{item.standard_msp.toLocaleString('en-IN')}/Qtl
                    </span>
                  )}
                </div>
              </div>

              {/* Sowing & Harvest Schedule Banner */}
              <div className="grid grid-cols-2 gap-2 bg-stone-50 border border-stone-200/80 rounded-xl p-3 mb-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Ideal Sowing Window
                  </span>
                  <span className="font-semibold text-stone-800 flex items-center mt-0.5">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    {item.sowing_period}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Harvesting Window
                  </span>
                  <span className="font-semibold text-stone-800 flex items-center mt-0.5">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    {item.harvesting_period}
                  </span>
                </div>
              </div>

              {/* Agronomic Info */}
              <p className="text-xs text-stone-600 leading-relaxed mb-4">
                {item.crop_info}
              </p>

              {/* Deep Agronomy Accordion / Pill details */}
              <div className="space-y-2 text-xs">
                {item.irrigation && (
                  <div className="flex items-start space-x-2 bg-blue-50/70 border border-blue-100 p-2.5 rounded-xl">
                    <Droplets className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-900 block font-bold text-[11px]">
                        Irrigation Schedule:
                      </strong>
                      <span className="text-blue-950 text-[11px] leading-relaxed">
                        {item.irrigation}
                      </span>
                    </div>
                  </div>
                )}

                {item.pest_management && (
                  <div className="flex items-start space-x-2 bg-amber-50/70 border border-amber-100 p-2.5 rounded-xl">
                    <Bug className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-900 block font-bold text-[11px]">
                        Scout & Pest Prevention:
                      </strong>
                      <span className="text-amber-950 text-[11px] leading-relaxed">
                        {item.pest_management}
                      </span>
                    </div>
                  </div>
                )}

                {item.regional_tip && (
                  <div className="flex items-start space-x-2 bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-xl">
                    <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-900 block font-bold text-[11px]">
                        Field Agronomist Recommendation:
                      </strong>
                      <span className="text-emerald-950 text-[11px] leading-relaxed">
                        {item.regional_tip}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action */}
            <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                ICAR & State Agriculture Board Verified
              </span>
              <button
                onClick={() => onNavigateToPrices(item.crop)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
              >
                <span>Compare Mandi Rates</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
