export interface Farmer {
  id: number;
  name: string;
  mobile: string;
  email: string;
  village: string;
  district: string;
  state: string;
  language: string;
  farm_size_acres?: number;
  created_at?: string;
}

export interface Buyer {
  id: number;
  name: string;
  business_name: string;
  location: string;
  verified: boolean;
  phone?: string;
  rating?: number;
  reviews_count?: number;
}

export interface BuyerOffer {
  id: number;
  buyer_id: number;
  buyer_name: string;
  business_name: string;
  buyer_location: string;
  buyer_verified: boolean;
  buyer_phone?: string;
  buyer_rating?: number;
  crop_id: number;
  crop_name: string;
  price: number;
  quantity: number;
  payment_terms: string;
  distance_km: number;
  created_at?: string;
}

export interface Crop {
  id: number;
  name: string;
  hindi_name?: string;
  category: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | string;
  sowing_period: string;
  harvesting_period?: string;
  demand: 'Low' | 'Moderate' | 'High' | 'Very High' | string;
  advisory?: string;
  standard_msp?: number;
}

export interface Mandi {
  id: number;
  name: string;
  location: string;
  state: string;
  contact_number?: string;
}

export interface MarketPrice {
  id: number;
  crop_id: number;
  crop_name: string;
  mandi_id: number;
  mandi_name: string;
  mandi_location: string;
  mandi_state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  trend: 'up' | 'down' | 'stable';
  date: string;
}

export interface TransportProvider {
  id: number;
  name: string;
  phone: string;
  vehicle_type: string;
  vehicle_number?: string;
  capacity: number;
  capacity_unit: string;
  start_location: string;
  destination: string;
  rate_per_km: number;
  availability: string;
  verified: boolean;
  rating: number;
  completed_trips: number;
}

export interface SharedTransportMember {
  id: number;
  shared_transport_id: number;
  farmer_id: number;
  farmer_name: string;
  booked_quantity: number;
  share_amount: number;
  joined_at?: string;
}

export interface SharedTransport {
  id: number;
  farmer_id: number;
  organizer_name: string;
  organizer_mobile?: string;
  start_village: string;
  destination: string;
  travel_date: string;
  vehicle_type: string;
  total_capacity: number;
  available_capacity: number;
  total_cost: number;
  status: 'Open' | 'Full' | 'Completed' | string;
  participating_count?: number;
  cost_per_quintal?: number;
  members: SharedTransportMember[];
  created_at?: string;
}

export interface NetProfitCalculation {
  crop: string;
  quantity: number;
  selling_price: number;
  distance: number;
  transport_rate: number;
  mandi_fee_percent: number;
  total_crop_value: number;
  transport_cost: number;
  mandi_fee: number;
  estimated_net_amount: number;
  net_per_unit: number;
  shared_transport_cost?: number;
  shared_net_amount?: number;
  potential_savings?: number;
  expense_breakdown?: {
    net_income_ratio: number;
    transport_ratio: number;
    mandi_fee_ratio: number;
  };
}

export interface CropAdvisoryItem {
  id: number;
  crop: string;
  hindi_name?: string;
  season: string;
  sowing_period: string;
  harvesting_period?: string;
  market_demand: string;
  standard_msp?: number;
  crop_info?: string;
  regional_tip?: string;
  irrigation?: string;
  pest_management?: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  native: string;
  badge: string;
}
