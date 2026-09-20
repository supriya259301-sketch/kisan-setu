import React, { useState, useEffect } from 'react';
import {
  Calculator,
  IndianRupee,
  TrendingUp,
  Truck,
  Percent,
  MapPin,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { Crop, NetProfitCalculation } from '../types';
import { ApiService } from '../services/apiService';

interface CalculatorViewProps {
  crops: Crop[];
  t: (key: string) => string;
  initialValues?: {
    crop?: string;
    price?: number;
    distance?: number;
  };
  setActiveTab: (tab: string) => void;
}

export const CalculatorView: React.FC<CalculatorViewProps> = ({
  crops,
  t,
  initialValues,
  setActiveTab,
}) => {
  const [crop, setCrop] = useState<string>(initialValues?.crop || 'Wheat');
  const [quantity, setQuantity] = useState<number>(100);
  const [sellingPrice, setSellingPrice] = useState<number>(initialValues?.price || 2480);
  const [distance, setDistance] = useState<number>(initialValues?.distance || 25);
  const [transportRate, setTransportRate] = useState<number>(14);
  const [mandiFeePercent, setMandiFeePercent] = useState<number>(2.0);

  const [calculation, setCalculation] = useState<NetProfitCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto calculate whenever inputs change
  useEffect(() => {
    runCalculation();
  }, [crop, quantity, sellingPrice, distance, transportRate, mandiFeePercent]);

  // If initialValues changes (e.g. user clicked "Calculate Net" from another page)
  useEffect(() => {
    if (initialValues?.crop) setCrop(initialValues.crop);
    if (initialValues?.price) setSellingPrice(initialValues.price);
    if (initialValues?.distance) setDistance(initialValues.distance);
  }, [initialValues]);

  const runCalculation = async () => {
    setLoading(true);
    try {
      const result = await ApiService.calculateProfit({
        crop,
        quantity: Number(quantity) || 0,
        selling_price: Number(sellingPrice) || 0,
        distance: Number(distance) || 0,
        transport_rate: Number(transportRate) || 0,
        mandi_fee_percent: Number(mandiFeePercent) || 0,
      });
      setCalculation(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const setPreset = (name: string) => {
    if (name === 'local_mandi') {
      setQuantity(80);
      setSellingPrice(2420);
      setDistance(18);
      setTransportRate(12);
      setMandiFeePercent(2.0);
    } else if (name === 'delhi_apmc') {
      setQuantity(150);
      setSellingPrice(2560);
      setDistance(85);
      setTransportRate(22);
      setMandiFeePercent(2.5);
    } else if (name === 'direct_buyer') {
      setQuantity(100);
      setSellingPrice(2500);
      setDistance(20);
      setTransportRate(14);
      setMandiFeePercent(0.0); // Direct buyers typically charge zero mandi fee to farmers!
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900 font-serif">
          {t('calculator')}
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Know your real in-hand earnings before dispatching your crop. Factor in diesel, driver rates, and APMC market cess.
        </p>
      </div>

      {/* Quick Scenario Presets */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0">
          Quick Presets:
        </span>
        <button
          onClick={() => setPreset('local_mandi')}
          className="text-xs font-bold bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer shrink-0"
        >
          Local Khanna Mandi (18 km)
        </button>
        <button
          onClick={() => setPreset('delhi_apmc')}
          className="text-xs font-bold bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 px-3 py-1.5 rounded-lg border border-stone-200 transition cursor-pointer shrink-0"
        >
          Azadpur Terminal Mandi (85 km)
        </button>
        <button
          onClick={() => setPreset('direct_buyer')}
          className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-300 transition cursor-pointer shrink-0"
        >
          Direct Corporate Buyer (Zero Mandi Cess)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Enter Crop & Logistics Parameters</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              Live Auto-Calculating
            </span>
          </div>

          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Select Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              {crops.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} {c.hindi_name ? `(${c.hindi_name})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t('cropQuantity')}
              </label>
              <span className="text-[11px] text-stone-400">1 Quintal = 100 kg</span>
            </div>
            <div className="relative">
              <Scale className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
              />
            </div>
          </div>

          {/* Expected Price */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('sellingPrice')} (₹ per Quintal)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="number"
                min="100"
                step="10"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-800"
              />
            </div>
          </div>

          {/* Distance */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('distanceKm')} (One-way to buyer/mandi)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="number"
                min="1"
                value={distance}
                onChange={(e) => setDistance(Math.max(0, Number(e.target.value)))}
                className="w-full pl-9 pr-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
          </div>

          {/* Transport Rate & Mandi Fee Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('transportRate')} (₹/km)
              </label>
              <div className="relative">
                <Truck className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={transportRate}
                  onChange={(e) => setTransportRate(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-2 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                {t('mandiFeePercent')} (%)
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.5"
                  value={mandiFeePercent}
                  onChange={(e) => setMandiFeePercent(Math.max(0, Number(e.target.value)))}
                  className="w-full pl-9 pr-2 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 flex items-center space-x-1 pt-2">
            <HelpCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Formula: Net Amount = Crop Value - Transport - Mandi Cess</span>
          </div>
        </div>

        {/* Right Column: Mathematical Net Breakdown & Decision Engine */}
        <div className="lg:col-span-7 space-y-4">
          {calculation ? (
            <>
              {/* Primary Estimated In-Hand Card */}
              <div className="bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="relative z-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                    {t('estimatedNetAmount')} (In-Hand Cash)
                  </span>
                  <div className="text-3xl sm:text-4xl font-black font-mono text-amber-400 mb-2">
                    ₹{calculation.estimated_net_amount.toLocaleString('en-IN')}
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-emerald-100">
                    <span>
                      Realized Rate:{' '}
                      <strong className="text-white font-mono text-sm">
                        ₹{calculation.net_per_unit.toLocaleString('en-IN')}
                      </strong>{' '}
                      / Qtl
                    </span>
                    <span>•</span>
                    <span>
                      Gross Value: ₹{calculation.total_crop_value.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions & Math Breakdown Card */}
              <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Detailed Expense & Revenue Deductions
                </h3>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm py-1 border-b border-stone-100">
                    <span className="text-stone-600">
                      Total Crop Gross Value ({calculation.quantity} Qtl × ₹{calculation.selling_price})
                    </span>
                    <span className="font-mono font-bold text-stone-900">
                      +₹{calculation.total_crop_value.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-stone-100 text-red-600">
                    <span className="flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        Solo Transport Cost ({calculation.distance} km × ₹{calculation.transport_rate}/km)
                      </span>
                    </span>
                    <span className="font-mono font-bold">
                      -₹{calculation.transport_cost.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm py-1 border-b border-stone-100 text-red-600">
                    <span className="flex items-center space-x-1">
                      <Percent className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        Mandi Fee & APMC Market Cess ({calculation.mandi_fee_percent}%)
                      </span>
                    </span>
                    <span className="font-mono font-bold">
                      -₹{calculation.mandi_fee.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-base font-extrabold text-emerald-800 pt-2">
                    <span>Final Estimated In-Hand Net</span>
                    <span className="font-mono text-lg">
                      ₹{calculation.estimated_net_amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Expense Ratio Visual Bar */}
                <div className="pt-3 border-t border-stone-100">
                  <div className="flex justify-between text-[11px] font-semibold text-stone-500 mb-1">
                    <span>Farmer Retained: {calculation.expense_breakdown?.net_income_ratio || 97}%</span>
                    <span>
                      Deductions: {(100 - (calculation.expense_breakdown?.net_income_ratio || 97)).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-600 h-full"
                      style={{ width: `${calculation.expense_breakdown?.net_income_ratio || 97}%` }}
                      title="Net Profit"
                    ></div>
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${calculation.expense_breakdown?.transport_ratio || 2}%` }}
                      title="Transport"
                    ></div>
                    <div
                      className="bg-red-400 h-full"
                      style={{ width: `${calculation.expense_breakdown?.mandi_fee_ratio || 1}%` }}
                      title="Mandi Cess"
                    ></div>
                  </div>
                </div>
              </div>

              {/* Section 5 Requirement: Clear Advice on Direct Buyer vs Mandi vs Shared Transport */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Kisan Setu Profit Optimization Advice</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Shared Transport Opportunity */}
                  <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                      With F2F Shared Transport
                    </span>
                    <div className="text-base font-black text-emerald-800 font-mono mt-0.5">
                      ₹{(calculation.shared_net_amount ?? 0).toLocaleString('en-IN')}
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Save <strong className="text-emerald-700 font-bold">₹{(calculation.potential_savings ?? 0).toLocaleString('en-IN')}</strong> by booking with a neighbor traveling to the same mandi.
                    </p>
                    <button
                      onClick={() => setActiveTab('shared')}
                      className="mt-2 text-xs font-bold text-emerald-700 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Find open shared trips</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Direct Buyer Benefit */}
                  <div className="bg-white/80 border border-amber-200/60 rounded-xl p-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      With Direct Corporate Buyer
                    </span>
                    <div className="text-base font-black text-blue-900 font-mono mt-0.5">
                      +₹{calculation.mandi_fee.toLocaleString('en-IN')} extra
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">
                      Direct buyers purchase at farm gate or depot with zero APMC market fee deductions.
                    </p>
                    <button
                      onClick={() => setActiveTab('buyers')}
                      className="mt-2 text-xs font-bold text-blue-700 hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Browse direct buyer offers</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center text-stone-400">
              Calculating net amount...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
