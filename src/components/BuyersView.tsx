import React, { useState, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Phone,
  MessageSquare,
  Filter,
  ArrowUpDown,
  ShieldCheck,
  Scale,
  MapPin,
  Clock,
  IndianRupee,
  X,
  ExternalLink,
  ChevronRight,
  Mic
} from 'lucide-react';
import { BuyerOffer, Crop } from '../types';

interface BuyersViewProps {
  offers: BuyerOffer[];
  crops: Crop[];
  t: (key: string) => string;
  onOpenVoice: () => void;
  onSelectForCalculator?: (crop: string, price: number, distance: number) => void;
}

export const BuyersView: React.FC<BuyersViewProps> = ({
  offers,
  crops,
  t,
  onOpenVoice,
  onSelectForCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState<number>(100);
  const [sortBy, setSortBy] = useState<'price_desc' | 'price_asc' | 'distance_asc' | 'quantity_desc'>('price_desc');

  // Comparison state (Up to 3 offers)
  const [selectedForCompare, setSelectedForCompare] = useState<number[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Contact Modal state
  const [contactingOffer, setContactingOffer] = useState<BuyerOffer | null>(null);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [quoteQuantity, setQuoteQuantity] = useState('50');
  const [quoteNotes, setQuoteNotes] = useState('I have clean harvested crop ready for inspection.');

  // Filtering & Sorting
  const filteredOffers = useMemo(() => {
    return offers
      .filter((offer) => {
        const matchesSearch =
          offer.buyer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.crop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          offer.buyer_location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCrop =
          selectedCrop === 'all' ||
          offer.crop_name.toLowerCase() === selectedCrop.toLowerCase();

        const matchesVerified = !verifiedOnly || offer.buyer_verified;
        const matchesDistance = offer.distance_km <= maxDistance;

        return matchesSearch && matchesCrop && matchesVerified && matchesDistance;
      })
      .sort((a, b) => {
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'distance_asc') return a.distance_km - b.distance_km;
        if (sortBy === 'quantity_desc') return b.quantity - a.quantity;
        return 0;
      });
  }, [offers, searchQuery, selectedCrop, verifiedOnly, maxDistance, sortBy]);

  const toggleCompare = (id: number) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((item) => item !== id));
    } else {
      if (selectedForCompare.length >= 3) {
        alert('You can compare up to 3 buyer offers at a time.');
        return;
      }
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  const comparedOffers = useMemo(() => {
    return offers.filter((o) => selectedForCompare.includes(o.id));
  }, [offers, selectedForCompare]);

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setContactingOffer(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {t('buyers')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Connect directly with verified corporate buyers, mills, and agro-exporters. No middlemen deductions.
          </p>
        </div>

        {selectedForCompare.length > 0 && (
          <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-2 self-start sm:self-auto">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-emerald-800">
              {selectedForCompare.length} offers selected
            </span>
            <button
              onClick={() => setShowCompareModal(true)}
              className="ml-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1 rounded-lg transition cursor-pointer shadow-2xs"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-stone-400 hover:text-stone-700 text-xs p-1"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by buyer name, business, crop, or district..."
              className="w-full pl-9 pr-10 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={onOpenVoice}
              className="absolute right-2 top-2 p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
              title="Voice Search"
            >
              <Mic className="w-4 h-4 text-amber-600" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 border border-stone-300 rounded-lg px-3 py-1.5 bg-stone-50 text-xs font-medium">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent focus:outline-none text-stone-700 font-semibold cursor-pointer"
              >
                <option value="price_desc">Highest Price First</option>
                <option value="price_asc">Lowest Price First</option>
                <option value="distance_asc">Nearest Distance First</option>
                <option value="quantity_desc">Largest Quantity First</option>
              </select>
            </div>

            {/* Verified Only Checkbox */}
            <label className="flex items-center space-x-1.5 border border-stone-300 rounded-lg px-3 py-2 bg-stone-50 text-xs font-medium text-stone-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>Verified Buyers Only</span>
            </label>
          </div>
        </div>

        {/* Crop Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1">
            Crop:
          </span>
          <button
            onClick={() => setSelectedCrop('all')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedCrop === 'all'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Crops ({offers.length})
          </button>
          {crops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.name)}
              className={`px-3 py-1 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCrop.toLowerCase() === c.name.toLowerCase()
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {c.name} {c.hindi_name ? `(${c.hindi_name})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Offers Results Grid */}
      {filteredOffers.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <Scale className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No buyer offers match your criteria</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, resetting the crop filter, or turning off the verified-only toggle.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCrop('all');
              setVerifiedOnly(false);
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOffers.map((offer) => {
            const isCompared = selectedForCompare.includes(offer.id);
            return (
              <div
                key={offer.id}
                className={`bg-white border rounded-xl p-5 shadow-xs transition hover:shadow-md flex flex-col justify-between relative ${
                  isCompared ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200'
                }`}
              >
                <div>
                  {/* Top Row: Business Name & Verification */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-sm font-bold text-stone-900">
                          {offer.business_name}
                        </span>
                        {offer.buyer_verified && (
                          <span
                            className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded"
                            title="Government / APMC Verified Buyer"
                          >
                            <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500">
                        Representative: <span className="font-semibold text-stone-700">{offer.buyer_name}</span>
                      </p>
                    </div>

                    {/* Compare Checkbox */}
                    <button
                      onClick={() => toggleCompare(offer.id)}
                      className={`text-[11px] font-semibold px-2 py-1 rounded border transition cursor-pointer flex items-center space-x-1 ${
                        isCompared
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      <Scale className="w-3 h-3" />
                      <span>{isCompared ? 'Compared' : 'Compare'}</span>
                    </button>
                  </div>

                  {/* Price & Crop Highlight */}
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 my-3 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                        Crop Demanded
                      </span>
                      <span className="text-base font-extrabold text-stone-900">
                        {offer.crop_name}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                        Offered Price
                      </span>
                      <div className="text-xl font-black text-emerald-700 font-mono">
                        ₹{offer.price.toLocaleString('en-IN')}{' '}
                        <span className="text-xs font-sans font-medium text-stone-500">/ Qtl</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Deal Terms Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-4">
                    <div className="flex items-center space-x-1.5">
                      <Scale className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        Req: <strong className="text-stone-800">{offer.quantity} Quintals</strong>
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>
                        {offer.buyer_location} ({offer.distance_km} km)
                      </span>
                    </div>
                    <div className="col-span-2 flex items-start space-x-1.5 text-[11px] text-stone-500 bg-stone-100/70 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>Payment:</strong> {offer.payment_terms}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  {onSelectForCalculator && (
                    <button
                      onClick={() =>
                        onSelectForCalculator(offer.crop_name, offer.price, offer.distance_km)
                      }
                      className="text-xs font-semibold text-stone-600 hover:text-emerald-700 underline cursor-pointer"
                    >
                      Calculate Net In-Hand
                    </button>
                  )}

                  <button
                    onClick={() => setContactingOffer(offer)}
                    className="ml-auto inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('contactBuyer')}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal (Section 3: Compare Offers) */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 border border-stone-200 relative my-8">
            <button
              onClick={() => setShowCompareModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <Scale className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Side-by-Side Buyer Offer Comparison
              </h3>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              Compare prices, payment security, and transport distance to make the best selling decision.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="py-2.5 px-3 font-bold text-stone-400 uppercase tracking-wider bg-stone-50 w-36">
                      Parameter
                    </th>
                    {comparedOffers.map((offer) => (
                      <th key={offer.id} className="py-2.5 px-3 font-bold text-stone-800 bg-stone-50">
                        {offer.business_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Crop</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3 font-semibold text-stone-900">
                        {o.crop_name}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Offered Price</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3 font-mono font-black text-emerald-700 text-sm">
                        ₹{o.price.toLocaleString('en-IN')} / Qtl
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Required Quantity</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3 text-stone-800">
                        {o.quantity} Quintals
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Distance from Farm</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3 text-stone-800">
                        {o.distance_km} km ({o.buyer_location})
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Payment Terms</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3 text-stone-700 text-[11px]">
                        {o.payment_terms}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Verification Status</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3">
                        {o.buyer_verified ? (
                          <span className="text-emerald-700 font-bold flex items-center">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> APMC Verified
                          </span>
                        ) : (
                          <span className="text-stone-500 font-medium">Standard Buyer</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-stone-600">Action</td>
                    {comparedOffers.map((o) => (
                      <td key={o.id} className="py-2.5 px-3">
                        <button
                          onClick={() => {
                            setShowCompareModal(false);
                            setContactingOffer(o);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs shadow-xs cursor-pointer"
                        >
                          Contact Buyer
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Contact Buyer Modal */}
      {contactingOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative">
            <button
              onClick={() => setContactingOffer(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-2">
              <Phone className="w-5 h-5" />
              <h3 className="text-lg font-bold">Contact {contactingOffer.business_name}</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Speak directly with {contactingOffer.buyer_name} or submit your quantity offer.
            </p>

            {contactSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">
                  Offer Sent to {contactingOffer.buyer_name}!
                </h4>
                <p className="text-xs text-emerald-700">
                  Buyer has received your details. They will call you directly at your registered mobile number shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-stone-800">{contactingOffer.buyer_name}</div>
                  <div className="text-xs text-stone-600 font-mono font-bold text-emerald-700">
                    Direct Phone: {contactingOffer.buyer_phone || '+91 98721 00123'}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    Location: {contactingOffer.buyer_location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${contactingOffer.buyer_phone || '9872100123'}`}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs text-center flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callNow')}</span>
                  </a>
                  <a
                    href={`https://wa.me/919872100123?text=Namaste, I am interested in your offer for ${contactingOffer.crop_name} on Kisan Setu.`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg font-bold text-xs text-center flex items-center justify-center space-x-1 shadow-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t('whatsappMessage')}</span>
                  </a>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                    Or Send Digital Crop Offer:
                  </span>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Your Quantity to Sell (Quintals)
                      </label>
                      <input
                        type="number"
                        value={quoteQuantity}
                        onChange={(e) => setQuoteQuantity(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Message / Quality Details
                      </label>
                      <textarea
                        rows={2}
                        value={quoteNotes}
                        onChange={(e) => setQuoteNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-3 py-2 bg-stone-900 hover:bg-black text-white rounded-lg font-bold text-xs transition cursor-pointer"
                  >
                    Submit Deal Confirmation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
