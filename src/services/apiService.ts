import {
  Farmer,
  Buyer,
  BuyerOffer,
  Crop,
  Mandi,
  MarketPrice,
  TransportProvider,
  SharedTransport,
  NetProfitCalculation,
  CropAdvisoryItem,
  LanguageOption
} from '../types';
import {
  INITIAL_CROPS,
  INITIAL_MANDIS,
  INITIAL_MARKET_PRICES,
  INITIAL_BUYERS,
  INITIAL_BUYER_OFFERS,
  INITIAL_TRANSPORTERS,
  INITIAL_SHARED_TRIPS,
  INITIAL_ADVISORY
} from '../data/mockData';
import { LANGUAGES } from '../translations';

const STORAGE_KEYS = {
  FARMER: 'kisan_setu_farmer',
  OFFERS: 'kisan_setu_buyer_offers',
  MARKET_PRICES: 'kisan_setu_market_prices',
  TRANSPORTERS: 'kisan_setu_transporters',
  SHARED_TRIPS: 'kisan_setu_shared_trips',
  ACTIVE_SESSION: 'kisan_setu_active_session',
  REGISTERED_USERS: 'kisan_setu_registered_users',
};

// Helper for local storage
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export class ApiService {
  // Try remote backend first, fallback to robust simulated persistence
  private static async request<T>(endpoint: string, options?: RequestInit): Promise<{ data?: T; error?: string; status?: number }> {
    try {
      const response = await fetch(endpoint, {
        headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
        credentials: 'include',
        ...options,
      });
      const json = await response.json().catch(() => null);
      if (response.ok) {
        return { data: json, status: response.status };
      }
      return {
        error: json?.error || json?.message || 'Request failed',
        status: response.status,
        data: json
      };
    } catch {
      // Server not reachable
      return { error: 'Network unavailable' };
    }
  }

  // --- AUTHENTICATION ---
  static async checkMe(): Promise<Farmer | null> {
    const remote = await this.request<{ logged_in: boolean; user?: Farmer; farmer?: Farmer }>('/api/auth/me');
    if (remote.data && remote.data.logged_in) {
      const farmer = remote.data.user || remote.data.farmer;
      if (farmer) {
        saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, farmer);
        return farmer;
      }
    }
    if (remote.status === 401 || (remote.data && !remote.data.logged_in)) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
      return null;
    }
    return loadFromStorage<Farmer | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  }

  static async login(mobileOrEmail: string, password: string): Promise<{ success: boolean; farmer?: Farmer; message: string }> {
    const cleanId = mobileOrEmail.trim();
    const cleanPass = password.trim();

    // 1. Try remote
    const remote = await this.request<{ success?: boolean; farmer?: Farmer; user?: Farmer; message?: string; error?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ mobile_or_email: cleanId, password: cleanPass })
    });

    if (remote.status === 401 || remote.error) {
      // Direct negative feedback from backend
      return {
        success: false,
        message: remote.data?.error || remote.error || 'Invalid email/mobile or password.'
      };
    }

    const remoteFarmer = remote.data?.farmer || remote.data?.user;
    if (remote.data?.success && remoteFarmer) {
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, remoteFarmer);
      return {
        success: true,
        farmer: remoteFarmer,
        message: remote.data.message || `Welcome, ${remoteFarmer.name}`
      };
    }

    // 2. Offline fallback (only when network call failed)
    const registered = loadFromStorage<(Farmer & { password?: string })[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    const localMatch = registered.find(u => (u.mobile === cleanId || u.email?.toLowerCase() === cleanId.toLowerCase()) && u.password === cleanPass);

    if (localMatch) {
      const { password: _, ...farmerOnly } = localMatch;
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, farmerOnly);
      return { success: true, farmer: farmerOnly, message: `Welcome, ${farmerOnly.name}` };
    }

    // Demo account fallback if offline
    if ((cleanId === '9876543210' || cleanId === 'demo') && cleanPass === 'kisan123') {
      const demoUser: Farmer = {
        id: 1,
        name: 'Demo Farmer',
        mobile: '9876543210',
        email: 'farmer.demo@kisansetu.in',
        village: 'Kishanpur',
        district: 'Ludhiana',
        state: 'Punjab',
        language: 'en',
        farm_size_acres: 5.0,
        created_at: new Date().toISOString()
      };
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, demoUser);
      return { success: true, farmer: demoUser, message: 'Welcome, Demo Farmer' };
    }

    return { success: false, message: 'Invalid email/mobile or password.' };
  }

  static async register(data: Partial<Farmer> & { password?: string }): Promise<{ success: boolean; farmer?: Farmer; message: string }> {
    const remote = await this.request<{ success?: boolean; farmer?: Farmer; user?: Farmer; message?: string; error?: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (remote.status === 400 || remote.status === 409 || remote.error) {
      return {
        success: false,
        message: remote.data?.error || remote.error || 'Registration failed.'
      };
    }

    const remoteFarmer = remote.data?.farmer || remote.data?.user;
    if (remote.data?.success && remoteFarmer) {
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, remoteFarmer);
      return {
        success: true,
        farmer: remoteFarmer,
        message: remote.data.message || 'Registration successful! Welcome to Kisan Setu.'
      };
    }

    // Offline fallback: save locally
    const newFarmer: Farmer = {
      id: Date.now(),
      name: data.name?.trim() || 'Farmer',
      mobile: data.mobile?.trim() || '',
      email: data.email?.trim() || `${data.mobile}@farmer.kisansetu.in`,
      village: data.village?.trim() || '',
      district: data.district?.trim() || '',
      state: data.state?.trim() || 'Punjab',
      language: data.language || 'en',
      farm_size_acres: data.farm_size_acres || 5.0,
      created_at: new Date().toISOString()
    };

    const registered = loadFromStorage<(Farmer & { password?: string })[]>(STORAGE_KEYS.REGISTERED_USERS, []);
    registered.push({ ...newFarmer, password: data.password });
    saveToStorage(STORAGE_KEYS.REGISTERED_USERS, registered);
    saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, newFarmer);

    return {
      success: true,
      farmer: newFarmer,
      message: 'Registration successful! Welcome to Kisan Setu.'
    };
  }

  static async logout(): Promise<void> {
    await this.request('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }

  static getActiveSession(): Farmer | null {
    return loadFromStorage<Farmer | null>(STORAGE_KEYS.ACTIVE_SESSION, null);
  }

  // --- FARMER PROFILE ---
  static async getProfile(): Promise<Farmer | null> {
    const remote = await this.request<{ profile: Farmer }>('/api/farmer/profile');
    if (remote.data?.profile) {
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, remote.data.profile);
      return remote.data.profile;
    }
    return this.getActiveSession();
  }

  static async updateProfile(data: Partial<Farmer>): Promise<Farmer> {
    const remote = await this.request<{ profile: Farmer }>('/api/farmer/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (remote.data?.profile) {
      saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, remote.data.profile);
      return remote.data.profile;
    }

    const current = this.getActiveSession();
    if (!current) {
      throw new Error('Not logged in');
    }
    const updated = { ...current, ...data };
    saveToStorage(STORAGE_KEYS.ACTIVE_SESSION, updated);
    return updated;
  }

  // --- BUYER OFFERS ---
  static async getBuyerOffers(crop?: string, maxDistance?: number, sortBy: string = 'price_desc'): Promise<BuyerOffer[]> {
    const params = new URLSearchParams();
    if (crop && crop !== 'all') params.set('crop', crop);
    if (maxDistance) params.set('max_distance', maxDistance.toString());
    params.set('sort_by', sortBy);

    const remote = await this.request<{ offers: BuyerOffer[] }>(`/api/buyer-offers?${params.toString()}`);
    if (remote.data?.offers) return remote.data.offers;

    let offers = loadFromStorage<BuyerOffer[]>(STORAGE_KEYS.OFFERS, INITIAL_BUYER_OFFERS);
    if (crop && crop.toLowerCase() !== 'all') {
      offers = offers.filter(o => o.crop_name.toLowerCase().includes(crop.toLowerCase()));
    }
    if (maxDistance) {
      offers = offers.filter(o => o.distance_km <= maxDistance);
    }

    if (sortBy === 'price_desc') {
      offers.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'price_asc') {
      offers.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'distance_asc') {
      offers.sort((a, b) => a.distance_km - b.distance_km);
    } else if (sortBy === 'quantity_desc') {
      offers.sort((a, b) => b.quantity - a.quantity);
    }

    return offers;
  }

  // --- MARKET PRICES ---
  static async getMarketPrices(crop?: string, mandiId?: number): Promise<MarketPrice[]> {
    const params = new URLSearchParams();
    if (crop && crop !== 'all') params.set('crop', crop);
    if (mandiId) params.set('mandi_id', mandiId.toString());

    const remote = await this.request<{ prices: MarketPrice[] }>(`/api/market-prices?${params.toString()}`);
    if (remote.data?.prices) return remote.data.prices;

    let prices = loadFromStorage<MarketPrice[]>(STORAGE_KEYS.MARKET_PRICES, INITIAL_MARKET_PRICES);
    if (crop && crop.toLowerCase() !== 'all') {
      prices = prices.filter(p => p.crop_name.toLowerCase().includes(crop.toLowerCase()));
    }
    if (mandiId) {
      prices = prices.filter(p => p.mandi_id === mandiId);
    }
    return prices;
  }

  // --- NET AMOUNT CALCULATOR ---
  static async calculateProfit(input: {
    crop: string;
    quantity: number;
    selling_price: number;
    distance: number;
    transport_rate: number;
    mandi_fee_percent: number;
  }): Promise<NetProfitCalculation> {
    const remote = await this.request<NetProfitCalculation>('/api/profit/calculate', {
      method: 'POST',
      body: JSON.stringify(input)
    });
    if (remote.data?.total_crop_value !== undefined) return remote.data;

    // Mathematical formula mandated by user:
    const totalCropValue = Math.round(input.quantity * input.selling_price * 100) / 100;
    const transportCost = Math.round(input.distance * input.transport_rate * 100) / 100;
    const mandiFee = Math.round((totalCropValue * input.mandi_fee_percent / 100) * 100) / 100;
    const estimatedNetAmount = Math.round((totalCropValue - transportCost - mandiFee) * 100) / 100;

    const netPerUnit = input.quantity > 0 ? Math.round((estimatedNetAmount / input.quantity) * 100) / 100 : 0;
    const sharedTransportCost = Math.round(transportCost * 0.55 * 100) / 100;
    const sharedNetAmount = Math.round((totalCropValue - sharedTransportCost - mandiFee) * 100) / 100;
    const potentialSavings = Math.round((transportCost - sharedTransportCost) * 100) / 100;

    return {
      crop: input.crop,
      quantity: input.quantity,
      selling_price: input.selling_price,
      distance: input.distance,
      transport_rate: input.transport_rate,
      mandi_fee_percent: input.mandi_fee_percent,
      total_crop_value: totalCropValue,
      transport_cost: transportCost,
      mandi_fee: mandiFee,
      estimated_net_amount: estimatedNetAmount,
      net_per_unit: netPerUnit,
      shared_transport_cost: sharedTransportCost,
      shared_net_amount: sharedNetAmount,
      potential_savings: potentialSavings,
      expense_breakdown: {
        net_income_ratio: totalCropValue > 0 ? Math.round((estimatedNetAmount / totalCropValue) * 1000) / 10 : 0,
        transport_ratio: totalCropValue > 0 ? Math.round((transportCost / totalCropValue) * 1000) / 10 : 0,
        mandi_fee_ratio: totalCropValue > 0 ? Math.round((mandiFee / totalCropValue) * 1000) / 10 : 0
      }
    };
  }

  // --- DIRECT LOGISTICS ---
  static async getLogistics(vehicle?: string, destination?: string): Promise<TransportProvider[]> {
    const params = new URLSearchParams();
    if (vehicle && vehicle !== 'all') params.set('vehicle', vehicle);
    if (destination) params.set('destination', destination);

    const remote = await this.request<{ providers: TransportProvider[] }>(`/api/logistics?${params.toString()}`);
    if (remote.data?.providers) return remote.data.providers;

    let transporters = loadFromStorage<TransportProvider[]>(STORAGE_KEYS.TRANSPORTERS, INITIAL_TRANSPORTERS);
    if (vehicle && vehicle.toLowerCase() !== 'all') {
      transporters = transporters.filter(t => t.vehicle_type.toLowerCase().includes(vehicle.toLowerCase()));
    }
    if (destination) {
      transporters = transporters.filter(t => t.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    return transporters;
  }

  // --- SHARED TRANSPORT (F2F) ---
  static async getSharedTrips(destination?: string, date?: string): Promise<SharedTransport[]> {
    const params = new URLSearchParams();
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);

    const remote = await this.request<{ trips: SharedTransport[] }>(`/api/shared-transport?${params.toString()}`);
    if (remote.data?.trips) return remote.data.trips;

    let trips = loadFromStorage<SharedTransport[]>(STORAGE_KEYS.SHARED_TRIPS, INITIAL_SHARED_TRIPS);
    if (destination) {
      trips = trips.filter(t => t.destination.toLowerCase().includes(destination.toLowerCase()));
    }
    return trips;
  }

  static async createSharedTrip(tripData: {
    start_village: string;
    destination: string;
    travel_date: string;
    vehicle_type: string;
    total_capacity: number;
    farmer_load: number;
    total_cost: number;
  }): Promise<{ success: boolean; trip?: SharedTransport; message: string }> {
    const farmer = this.getActiveSession();
    if (!farmer) {
      return { success: false, message: 'Please login to create a shared trip.' };
    }

    const remote = await this.request<{ success: boolean; trip: SharedTransport; message: string }>('/api/shared-transport', {
      method: 'POST',
      body: JSON.stringify({ farmer_id: farmer.id, ...tripData })
    });
    if (remote.data?.success && remote.data.trip) {
      return remote.data;
    }

    const availableCapacity = Math.max(0, tripData.total_capacity - tripData.farmer_load);
    const organizerShare = Math.round((tripData.farmer_load / tripData.total_capacity) * tripData.total_cost);

    const newTrip: SharedTransport = {
      id: Math.floor(Math.random() * 9000) + 100,
      farmer_id: farmer.id,
      organizer_name: farmer.name,
      organizer_mobile: farmer.mobile,
      start_village: tripData.start_village || farmer.village,
      destination: tripData.destination,
      travel_date: tripData.travel_date,
      vehicle_type: tripData.vehicle_type,
      total_capacity: tripData.total_capacity,
      available_capacity: availableCapacity,
      total_cost: tripData.total_cost,
      status: availableCapacity > 0 ? 'Open' : 'Full',
      participating_count: 1,
      cost_per_quintal: Math.round(tripData.total_cost / tripData.total_capacity),
      members: [
        {
          id: 1,
          shared_transport_id: 100,
          farmer_id: farmer.id,
          farmer_name: `${farmer.name} (Organizer)`,
          booked_quantity: tripData.farmer_load,
          share_amount: organizerShare
        }
      ]
    };

    const trips = loadFromStorage<SharedTransport[]>(STORAGE_KEYS.SHARED_TRIPS, INITIAL_SHARED_TRIPS);
    const updated = [newTrip, ...trips];
    saveToStorage(STORAGE_KEYS.SHARED_TRIPS, updated);

    return {
      success: true,
      trip: newTrip,
      message: `Shared trip to ${newTrip.destination} created successfully! Other farmers can now join.`
    };
  }

  static async joinSharedTrip(tripId: number, bookedQuantity: number): Promise<{
    success: boolean;
    trip?: SharedTransport;
    shareAmount?: number;
    estimatedSavings?: number;
    message: string;
  }> {
    const farmer = this.getActiveSession();
    if (!farmer) {
      return { success: false, message: 'Please login to join a shared trip.' };
    }

    const remote = await this.request<{
      success: boolean;
      trip: SharedTransport;
      share_amount: number;
      estimated_savings: number;
      message: string;
    }>(`/api/shared-transport/${tripId}/join`, {
      method: 'POST',
      body: JSON.stringify({ farmer_id: farmer.id, quantity: bookedQuantity })
    });
    if (remote.data?.success) {
      return {
        success: true,
        trip: remote.data.trip,
        shareAmount: remote.data.share_amount,
        estimatedSavings: remote.data.estimated_savings,
        message: remote.data.message
      };
    }

    const trips = loadFromStorage<SharedTransport[]>(STORAGE_KEYS.SHARED_TRIPS, INITIAL_SHARED_TRIPS);
    const trip = trips.find(t => t.id === tripId);
    if (!trip) {
      return { success: false, message: 'Trip not found.' };
    }
    if (bookedQuantity > trip.available_capacity) {
      return { success: false, message: `Only ${trip.available_capacity} Qtl space available in this vehicle.` };
    }

    const shareAmount = Math.round((bookedQuantity / trip.total_capacity) * trip.total_cost);
    const soloHiringCost = trip.total_cost;
    const estimatedSavings = Math.round(soloHiringCost - shareAmount);

    trip.available_capacity = Math.round((trip.available_capacity - bookedQuantity) * 10) / 10;
    if (trip.available_capacity <= 0) trip.status = 'Full';
    trip.participating_count = (trip.participating_count || 1) + 1;

    trip.members.push({
      id: Date.now(),
      shared_transport_id: trip.id,
      farmer_id: farmer.id,
      farmer_name: farmer.name,
      booked_quantity: bookedQuantity,
      share_amount: shareAmount
    });

    saveToStorage(STORAGE_KEYS.SHARED_TRIPS, trips);

    return {
      success: true,
      trip,
      shareAmount,
      estimatedSavings,
      message: `You have joined the trip to ${trip.destination}! Your share is ₹${shareAmount.toLocaleString('en-IN')}, saving ₹${estimatedSavings.toLocaleString('en-IN')}.`
    };
  }

  // --- CROP ADVISORY ---
  static async getCropAdvisory(location?: string, season?: string, crop?: string): Promise<CropAdvisoryItem[]> {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (season && season !== 'all') params.set('season', season);
    if (crop && crop !== 'all') params.set('crop', crop);

    const remote = await this.request<{ advisory: CropAdvisoryItem[] }>(`/api/crop-advisory?${params.toString()}`);
    if (remote.data?.advisory) return remote.data.advisory;

    let items = INITIAL_ADVISORY;
    if (season && season.toLowerCase() !== 'all') {
      items = items.filter(i => i.season.toLowerCase() === season.toLowerCase());
    }
    if (crop && crop.toLowerCase() !== 'all') {
      items = items.filter(i => i.crop.toLowerCase().includes(crop.toLowerCase()));
    }
    return items;
  }

  // --- LANGUAGES ---
  static async getLanguages(): Promise<LanguageOption[]> {
    const remote = await this.request<{ languages: LanguageOption[] }>('/api/languages');
    if (remote.data?.languages) return remote.data.languages;
    return LANGUAGES;
  }
}
