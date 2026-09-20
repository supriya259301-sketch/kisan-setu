import React, { useState, useMemo } from 'react';
import {
  Truck,
  Phone,
  Search,
  Filter,
  MapPin,
  Scale,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Star,
  X,
  MessageSquare,
  Mic,
  ArrowRight
} from 'lucide-react';
import { TransportProvider } from '../types';

interface LogisticsViewProps {
  providers: TransportProvider[];
  t: (key: string) => string;
  onOpenVoice: () => void;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  providers,
  t,
  onOpenVoice,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('all');
  const [destinationFilter, setDestinationFilter] = useState('all');

  // Booking Modal
  const [bookingProvider, setBookingProvider] = useState<TransportProvider | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [pickupDate, setPickupDate] = useState('Today (Within 2 hours)');
  const [loadQuintals, setLoadQuintals] = useState('35');
  const [cropToMove, setCropToMove] = useState('Wheat');
  const [pickupVillage, setPickupVillage] = useState('Kishanpur Village (Doraha)');

  const vehicleTypes = [
    'all',
    'Mini Truck',
    'Pickup',
    'Tractor Trolley',
    '10-Wheeler',
  ];

  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.vehicle_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.start_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.vehicle_number ? p.vehicle_number.toLowerCase().includes(searchQuery.toLowerCase()) : false);

      const matchesVehicle =
        vehicleFilter === 'all' ||
        p.vehicle_type.toLowerCase().includes(vehicleFilter.toLowerCase());

      const matchesDest =
        destinationFilter === 'all' ||
        p.destination.toLowerCase().includes(destinationFilter.toLowerCase());

      return matchesSearch && matchesVehicle && matchesDest;
    });
  }, [providers, searchQuery, vehicleFilter, destinationFilter]);

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setBookingProvider(null);
    }, 1800);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {t('logistics')}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Fair-rate verified agricultural vehicles, pickups, and tractors for mandi dispatch.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search driver, vehicle or route..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={onOpenVoice}
              className="absolute right-2 top-2 p-1 text-stone-400 hover:text-emerald-700 cursor-pointer"
            >
              <Mic className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>

          {/* Vehicle Type Filter */}
          <div>
            <select
              value={vehicleFilter}
              onChange={(e) => setVehicleFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">All Vehicle Types</option>
              <option value="Mini Truck">Mini Truck (Tata 407)</option>
              <option value="Pickup">Pickup (Bolero Maxi)</option>
              <option value="Tractor Trolley">Tractor Trolley</option>
              <option value="10-Wheeler">Heavy Multi-Axle Truck</option>
            </select>
          </div>

          {/* Destination Filter */}
          <div>
            <select
              value={destinationFilter}
              onChange={(e) => setDestinationFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-stone-700 cursor-pointer"
            >
              <option value="all">All Mandi Routes</option>
              <option value="Khanna">Khanna Mandi</option>
              <option value="Azadpur">Azadpur APMC (Delhi)</option>
              <option value="Vashi">Vashi APMC (Mumbai)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Providers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map((driver) => (
          <div
            key={driver.id}
            className="bg-white border border-stone-200 rounded-xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Header with Driver & Verification */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-sm font-bold text-stone-900">{driver.name}</span>
                    {driver.verified && (
                      <span
                        className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded"
                        title="Background Checked & Commercial Permit Verified"
                      >
                        <ShieldCheck className="w-3 h-3 mr-0.5 text-emerald-600" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-stone-500 mt-0.5">
                    <span className="flex items-center text-amber-600 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 mr-0.5" />
                      {driver.rating}
                    </span>
                    <span>•</span>
                    <span>{driver.completed_trips} mandi trips completed</span>
                  </div>
                </div>

                {/* Availability Badge */}
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    driver.availability.includes('Today')
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {driver.availability}
                </span>
              </div>

              {/* Vehicle & Plate Pill */}
              <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 my-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-stone-500" />
                    <div>
                      <div className="text-xs font-bold text-stone-800">{driver.vehicle_type}</div>
                      <div className="text-[10px] font-mono text-stone-500">{driver.vehicle_number}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Capacity
                    </span>
                    <span className="text-xs font-black text-stone-900 font-mono">
                      {driver.capacity} {driver.capacity_unit}
                    </span>
                  </div>
                </div>

                {/* Rate Highlight */}
                <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-xs text-stone-500">Transparent Base Rate:</span>
                  <div className="text-sm font-black text-emerald-800 font-mono">
                    ₹{driver.rate_per_km} <span className="text-[10px] font-normal text-stone-500">/ km</span>
                  </div>
                </div>
              </div>

              {/* Route */}
              <div className="space-y-1 text-xs text-stone-600 mb-4">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span className="truncate">
                    Route: <strong className="text-stone-800">{driver.start_location}</strong> →{' '}
                    <strong className="text-emerald-800">{driver.destination}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Driver Actions */}
            <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
              <a
                href={`tel:${driver.phone}`}
                className="py-1.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-bold text-center flex items-center justify-center space-x-1 transition"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-700" />
                <span>Call Driver</span>
              </a>

              <button
                onClick={() => setBookingProvider(driver)}
                className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold text-center transition cursor-pointer shadow-xs"
              >
                Book Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-200 relative my-8">
            <button
              onClick={() => setBookingProvider(null)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-emerald-700 mb-2">
              <Truck className="w-5 h-5" />
              <h3 className="text-lg font-bold">Book Dispatch: {bookingProvider.name}</h3>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Vehicle: {bookingProvider.vehicle_type} ({bookingProvider.vehicle_number}) • Rate: ₹{bookingProvider.rate_per_km}/km
            </p>

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-800">
                  Booking Request Confirmed!
                </h4>
                <p className="text-xs text-emerald-700">
                  Driver {bookingProvider.name} has been notified and will reach {pickupVillage} at the scheduled time.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Pickup Village / Farm Address
                  </label>
                  <input
                    type="text"
                    required
                    value={pickupVillage}
                    onChange={(e) => setPickupVillage(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Crop to Move
                    </label>
                    <input
                      type="text"
                      required
                      value={cropToMove}
                      onChange={(e) => setCropToMove(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Quantity (Quintals)
                    </label>
                    <input
                      type="number"
                      max={bookingProvider.capacity}
                      value={loadQuintals}
                      onChange={(e) => setLoadQuintals(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Requested Dispatch Time
                  </label>
                  <select
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  >
                    <option value="Today (Within 2 hours)">Today (Immediate / Within 2 hours)</option>
                    <option value="Tomorrow Morning 06:00 AM">Tomorrow Morning (06:00 AM)</option>
                    <option value="Tomorrow Afternoon 02:00 PM">Tomorrow Afternoon (02:00 PM)</option>
                  </select>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Target Mandi:</span>
                    <strong className="text-stone-900">{bookingProvider.destination}</strong>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Driver Direct Phone:</span>
                    <strong className="font-mono text-emerald-800">{bookingProvider.phone}</strong>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  Confirm & Dispatch Vehicle
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
