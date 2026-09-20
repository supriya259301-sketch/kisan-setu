import React, { useState } from 'react';
import {
  Users,
  Plus,
  Truck,
  MapPin,
  Calendar,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  X,
  Scale,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { SharedTransport, Farmer } from '../types';
import { ApiService } from '../services/apiService';

interface SharedTransportViewProps {
  trips: SharedTransport[];
  farmer: Farmer | null;
  t: (key: string) => string;
  onTripUpdated: () => void;
  onOpenAuth: () => void;
}

export const SharedTransportView: React.FC<SharedTransportViewProps> = ({
  trips,
  farmer,
  t,
  onTripUpdated,
  onOpenAuth,
}) => {
  // Join Modal State
  const [selectedTrip, setSelectedTrip] = useState<SharedTransport | null>(null);
  const [joinQuantity, setJoinQuantity] = useState<number>(10);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinResult, setJoinResult] = useState<{
    shareAmount: number;
    savings: number;
    message: string;
  } | null>(null);

  // Create Trip Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [startVillage, setStartVillage] = useState(farmer?.village || 'Kishanpur Village');
  const [destination, setDestination] = useState('Khanna Grain Market');
  const [travelDate, setTravelDate] = useState('Tomorrow, 06:30 AM');
  const [vehicleType, setVehicleType] = useState('Mini Truck (Tata 407)');
  const [totalCapacity, setTotalCapacity] = useState<number>(40);
  const [myLoad, setMyLoad] = useState<number>(15);
  const [totalCost, setTotalCost] = useState<number>(2400);

  // Dynamic calculation for Join Modal
  const calculatedShare = selectedTrip
    ? Math.round((joinQuantity / selectedTrip.total_capacity) * selectedTrip.total_cost)
    : 0;
  const calculatedSavings = selectedTrip
    ? Math.round(selectedTrip.total_cost - calculatedShare)
    : 0;

  const handleJoinTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) {
      onOpenAuth();
      return;
    }
    if (!selectedTrip) return;

    setJoinLoading(true);
    try {
      const res = await ApiService.joinSharedTrip(selectedTrip.id, joinQuantity);
      if (res.success) {
        setJoinResult({
          shareAmount: res.shareAmount || calculatedShare,
          savings: res.estimatedSavings || calculatedSavings,
          message: res.message,
        });
        onTripUpdated();
        setTimeout(() => {
          setSelectedTrip(null);
          setJoinResult(null);
        }, 2200);
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to join trip.');
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmer) {
      onOpenAuth();
      return;
    }

    setCreateLoading(true);
    try {
      const res = await ApiService.createSharedTrip({
        start_village: startVillage,
        destination,
        travel_date: travelDate,
        vehicle_type: vehicleType,
        total_capacity: Number(totalCapacity) || 40,
        farmer_load: Number(myLoad) || 10,
        total_cost: Number(totalCost) || 2000,
      });

      if (res.success) {
        setShowCreateModal(false);
        onTripUpdated();
      } else {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create trip.');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-stone-900 font-serif">
              {t('sharedTransport')}
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
              F2F Collective Pooling
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Split truck costs with neighboring farmers traveling to the same grain market. Pay only for the quintals you occupy.
          </p>
        </div>

        <button
          onClick={() => {
            if (!farmer) {
              onOpenAuth();
            } else {
              setShowCreateModal(true);
            }
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Shared Trip</span>
        </button>
      </div>

      {/* Dynamic Cost-Splitting Formula Explainer Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-teal-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Mathematical Dynamic Cost-Splitting Rule</span>
          </div>
          <div className="text-xs text-teal-100 leading-relaxed max-w-2xl font-mono">
            <strong>Share Amount</strong> = (Your Booked Quintals ÷ Vehicle Total Capacity) × Total Vehicle Cost
          </div>
          <p className="text-[11px] text-teal-200">
            <strong>Estimated Farmer Savings</strong> = Solo Hiring Cost - Your Share Amount (Average savings: ₹800 to ₹2,500 per harvest trip)
          </p>
        </div>

        <div className="bg-teal-900/80 border border-teal-700 rounded-xl p-3 text-center shrink-0 w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-teal-300 block">Typical Savings</span>
          <span className="text-xl font-black text-amber-400 font-mono">40% - 55%</span>
        </div>
      </div>

      {/* Trips Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {trips.map((trip) => {
          const bookedPct = Math.round(
            ((trip.total_capacity - trip.available_capacity) / trip.total_capacity) * 100
          );
          const isFull = trip.available_capacity <= 0 || trip.status === 'Full';

          return (
            <div
              key={trip.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Route & Status */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Trip Route
                    </span>
                    <div className="text-base font-bold text-stone-900 flex items-center space-x-1.5 mt-0.5">
                      <span className="truncate">{trip.start_village}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-emerald-800 font-extrabold truncate">
                        {trip.destination}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isFull
                        ? 'bg-stone-100 text-stone-600'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isFull ? 'Vehicle Full' : 'Open for Pooling'}
                  </span>
                </div>

                {/* Organizer & Timing info */}
                <div className="grid grid-cols-2 gap-2 text-xs text-stone-600 mb-4 bg-stone-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Organizer</span>
                    <span className="font-semibold text-stone-800 flex items-center mt-0.5">
                      <UserCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {trip.organizer_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Departure Date</span>
                    <span className="font-semibold text-stone-800 flex items-center mt-0.5">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-stone-400" />
                      {trip.travel_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Vehicle</span>
                    <span className="text-stone-700 font-medium">{trip.vehicle_type}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block font-bold uppercase">Cost per Quintal</span>
                    <span className="text-emerald-800 font-bold font-mono">
                      ₹{trip.cost_per_quintal || Math.round(trip.total_cost / trip.total_capacity)} / Qtl
                    </span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-stone-700">
                      Space Available: <strong className="text-emerald-700 font-mono">{trip.available_capacity} Qtl</strong>
                    </span>
                    <span className="text-stone-400">Total: {trip.total_capacity} Qtl</span>
                  </div>
                  <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        bookedPct > 80 ? 'bg-amber-500' : 'bg-emerald-600'
                      }`}
                      style={{ width: `${bookedPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Participating Farmers List */}
                <div className="border-t border-stone-100 pt-3 mb-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                    Participating Farmers ({trip.members.length}):
                  </span>
                  <div className="space-y-1">
                    {trip.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between text-xs py-1 px-2 rounded bg-stone-50"
                      >
                        <span className="font-medium text-stone-700 flex items-center">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 mr-1.5" />
                          {member.farmer_name}
                        </span>
                        <div className="font-mono text-stone-600 text-[11px]">
                          <span>{member.booked_quantity} Qtl</span>
                          <span className="mx-1">•</span>
                          <span className="font-bold text-emerald-800">₹{member.share_amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <div className="text-xs text-stone-500">
                  Total Trip Cost: <strong className="text-stone-900 font-mono">₹{trip.total_cost}</strong>
                </div>

                <button
                  disabled={isFull}
                  onClick={() => {
                    setSelectedTrip(trip);
                    setJoinQuantity(Math.min(10, trip.available_capacity));
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  {isFull ? 'Trip Full' : 'Join & Share Cost'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Join Trip Modal with Dynamic Cost Splitting */}
      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative my-8">
            <button
              onClick={() => setSelectedTrip(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-2">
              <Users className="w-5 h-5" />
              <h3 className="text-lg font-bold">Join Shared Trip to {selectedTrip.destination}</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Organizer: {selectedTrip.organizer_name} ({selectedTrip.organizer_mobile}) • Available: {selectedTrip.available_capacity} Qtl
            </p>

            {joinResult ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">
                  You Have Joined This Trip!
                </h4>
                <p className="text-xs text-emerald-700 font-medium">
                  {joinResult.message}
                </p>
                <div className="pt-2 text-xs text-stone-600">
                  Your exact share: <strong>₹{joinResult.shareAmount.toLocaleString('en-IN')}</strong> (Saved: ₹{joinResult.savings.toLocaleString('en-IN')})
                </div>
              </div>
            ) : (
              <form onSubmit={handleJoinTrip} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                      Your Crop Load Quantity (Quintals)
                    </label>
                    <span className="text-[11px] text-stone-400">
                      Max {selectedTrip.available_capacity} Qtl
                    </span>
                  </div>
                  <input
                    type="number"
                    required
                    min="1"
                    max={selectedTrip.available_capacity}
                    value={joinQuantity}
                    onChange={(e) =>
                      setJoinQuantity(
                        Math.min(
                          selectedTrip.available_capacity,
                          Math.max(1, Number(e.target.value))
                        )
                      )
                    }
                    className="w-full px-3 py-2 text-sm bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                  />
                </div>

                {/* Live Formula Preview Box */}
                <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Dynamic Cost Splitting Calculation
                  </span>

                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Formula:</span>
                    <span className="font-mono text-stone-800">
                      ({joinQuantity} / {selectedTrip.total_capacity}) × ₹{selectedTrip.total_cost}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm py-1 border-t border-stone-200/70 font-bold text-stone-800">
                    <span>Your Share Amount:</span>
                    <span className="font-mono text-emerald-800 text-base">
                      ₹{calculatedShare.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 p-2 rounded-lg">
                    <span>Estimated Solo Hiring Saving:</span>
                    <span className="font-mono">
                      +₹{calculatedSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={joinLoading}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
                >
                  {joinLoading ? 'Joining Trip...' : 'Confirm Shared Seat & Lock Share'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create New Trip Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative my-8">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-2">
              <Plus className="w-5 h-5" />
              <h3 className="text-lg font-bold">Post New Shared Transport Trip</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Organize a vehicle to the mandi and invite other farmers from your village to share the freight bill.
            </p>

            <form onSubmit={handleCreateTrip} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Starting Village / Cluster
                </label>
                <input
                  type="text"
                  required
                  value={startVillage}
                  onChange={(e) => setStartVillage(e.target.value)}
                  placeholder="e.g. Kishanpur Village (Doraha)"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Destination Mandi / Grain Market
                </label>
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Khanna Grain Market"
                  className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Mini Truck (Tata 407)">Mini Truck (Tata 407)</option>
                    <option value="Bolero Pickup">Pickup (Bolero Maxi)</option>
                    <option value="Tractor Trolley">Tractor Trolley</option>
                    <option value="Medium Truck (Eicher Pro)">Medium Truck (Eicher)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Departure Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    placeholder="e.g. Tomorrow, 06:00 AM"
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Total Cap (Qtl)
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={totalCapacity}
                    onChange={(e) => setTotalCapacity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Load (Qtl)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={totalCapacity}
                    value={myLoad}
                    onChange={(e) => setMyLoad(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Total Fare (₹)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
                <div className="flex justify-between text-stone-600">
                  <span>Available Space for Neighbors:</span>
                  <strong className="text-emerald-700 font-mono">
                    {Math.max(0, totalCapacity - myLoad)} Quintals
                  </strong>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Your Initial Share:</span>
                  <strong className="font-mono text-stone-900">
                    ₹{Math.round((myLoad / totalCapacity) * totalCost)}
                  </strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer disabled:opacity-50"
              >
                {createLoading ? 'Publishing Trip...' : 'Publish Trip to Local Farmers'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
