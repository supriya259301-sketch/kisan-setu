import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  LayoutGrid,
  List,
  Calculator,
  Mic,
  Award
} from 'lucide-react';
import { MarketPrice, Mandi, Crop } from '../types';

interface MarketPricesViewProps {
  prices: MarketPrice[];
  mandis: Mandi[];
  crops: Crop[];
  t: (key: string) => string;
  onOpenVoice: () => void;
  onSelectForCalculator?: (crop: string, price: number, distance: number) => void;
}

export const MarketPricesView: React.FC<MarketPricesViewProps> = ({
  prices,
  mandis,
  crops,
  t,
  onOpenVoice,
  onSelectForCalculator,
}) => {
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [selectedMandi, setSelectedMandi] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filtered prices
  const filteredPrices = useMemo(() => {
    return prices.filter((p) => {
      const matchesSearch =
        p.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mandi_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.mandi_state && p.mandi_state.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCrop =
        selectedCrop === 'all' || p.crop_name.toLowerCase() === selectedCrop.toLowerCase();

      const matchesMandi =
        selectedMandi === 'all' || p.mandi_id.toString() === selectedMandi;

      return matchesSearch && matchesCrop && matchesMandi;
    });
  }, [prices, searchQuery, selectedCrop, selectedMandi]);

  // Find absolute best prices per crop
  const bestPriceByCrop = useMemo(() => {
    const map: Record<string, MarketPrice> = {};
    prices.forEach((p) => {
      if (!map[p.crop_name] || p.modal_price > map[p.crop_name].modal_price) {
        map[p.crop_name] = p;
      }
    });
    return map;
  }, [prices]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {t('marketPrices')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time daily modal benchmark rates across major grain markets and APMCs.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 bg-stone-100 p-1 rounded-lg border border-stone-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cards')}
            className={`p-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              viewMode === 'cards'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-md text-xs font-bold transition flex items-center space-x-1 cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Best Price Highlights Carousel / Strip */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-4 text-stone-900 shadow-xs">
        <div className="flex items-center justify-between mb-3 text-stone-900">
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5 text-stone-950" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-950">
              Highest Mandi Benchmark Rates Today
            </h3>
          </div>
          <span className="text-[11px] font-semibold bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-full">
            Recommended Selling Destinations
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(Object.entries(bestPriceByCrop).slice(0, 4) as [string, MarketPrice][]).map(([cropName, bp]) => (
            <div
              key={cropName}
              className="bg-white/95 rounded-xl p-3 border border-amber-300/60 shadow-2xs"
            >
              <div className="text-xs font-bold text-stone-800">{cropName}</div>
              <div className="text-lg font-black text-emerald-800 font-mono my-0.5">
                ₹{bp.modal_price.toLocaleString('en-IN')}
                <span className="text-[10px] font-normal text-stone-500"> / Qtl</span>
              </div>
              <div className="text-[11px] text-stone-600 flex items-center truncate">
                <MapPin className="w-3 h-3 mr-1 text-amber-600 shrink-0" />
                <span className="truncate">{bp.mandi_name.split(' ')[0]} Mandi</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crop or mandi..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={onOpenVoice}
              className="absolute right-2 top-2 p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>

          {/* Crop Selector */}
          <div>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">All Crops ({crops.length})</option>
              {crops.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} {c.hindi_name ? `(${c.hindi_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Mandi Selector */}
          <div>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">All Mandis & APMCs</option>
              {mandis.map((m) => (
                <option key={m.id} value={m.id.toString()}>
                  {m.name} ({m.state})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content: Cards or Table */}
      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrices.map((price) => {
            const isBest = bestPriceByCrop[price.crop_name]?.id === price.id;
            return (
              <div
                key={price.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between ${
                  isBest ? 'border-amber-400 ring-1 ring-amber-400/30' : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-bold text-stone-900">
                          {price.crop_name}
                        </span>
                        {isBest && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded border border-amber-300">
                            ★ Best Rate
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500 flex items-center mt-0.5">
                        <MapPin className="w-3 h-3 mr-1 text-stone-400 shrink-0" />
                        <span>{price.mandi_name}</span>
                      </div>
                    </div>

                    {/* Trend badge */}
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 ${
                        price.trend === 'up'
                          ? 'bg-emerald-100 text-emerald-800'
                          : price.trend === 'down'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {price.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
                      {price.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
                      {price.trend === 'stable' && <Minus className="w-3 h-3" />}
                      <span className="uppercase">{price.trend}</span>
                    </span>
                  </div>

                  {/* Modal Price */}
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 my-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Modal Wholesale Rate
                    </span>
                    <div className="text-2xl font-black text-stone-900 font-mono">
                      ₹{price.modal_price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-sans font-medium text-stone-500">/ Qtl</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-500 mt-2 pt-2 border-t border-stone-200/50">
                      <span>
                        Min: <strong className="text-stone-700">₹{price.min_price}</strong>
                      </span>
                      <span>
                        Max: <strong className="text-stone-700">₹{price.max_price}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {price.date}
                  </span>

                  {onSelectForCalculator && (
                    <button
                      onClick={() =>
                        onSelectForCalculator(price.crop_name, price.modal_price, 25)
                      }
                      className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition cursor-pointer"
                    >
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Calculate Net</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Crop</th>
                  <th className="py-3 px-4">Mandi & Location</th>
                  <th className="py-3 px-4">Min Price</th>
                  <th className="py-3 px-4">Max Price</th>
                  <th className="py-3 px-4">Modal Price</th>
                  <th className="py-3 px-4">Trend</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPrices.map((price) => {
                  const isBest = bestPriceByCrop[price.crop_name]?.id === price.id;
                  return (
                    <tr key={price.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-4 font-bold text-stone-900 flex items-center space-x-1.5">
                        <span>{price.crop_name}</span>
                        {isBest && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1 py-0.2 rounded">
                            Best
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        <div className="font-semibold text-stone-800">{price.mandi_name}</div>
                        <div className="text-[10px] text-stone-400">{price.mandi_state}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-700">₹{price.min_price}</td>
                      <td className="py-3 px-4 font-mono text-stone-700">₹{price.max_price}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-sm">
                        ₹{price.modal_price.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                            price.trend === 'up'
                              ? 'bg-emerald-100 text-emerald-800'
                              : price.trend === 'down'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          <span className="uppercase">{price.trend}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {onSelectForCalculator && (
                          <button
                            onClick={() =>
                              onSelectForCalculator(price.crop_name, price.modal_price, 25)
                            }
                            className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                          >
                            Calculate Net
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
