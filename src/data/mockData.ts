import {
  Farmer,
  Buyer,
  BuyerOffer,
  Crop,
  Mandi,
  MarketPrice,
  TransportProvider,
  SharedTransport,
  CropAdvisoryItem
} from '../types';

export const INITIAL_CROPS: Crop[] = [
  { id: 1, name: 'Wheat', hindi_name: 'गेहूं', category: 'Grains', season: 'Rabi', sowing_period: 'Nov 01 - Dec 15', harvesting_period: 'Mar 15 - Apr 30', demand: 'Very High', standard_msp: 2275.0, advisory: 'Sow certified varieties like HD-2967 or PBW-550. First irrigation is critical at CRI stage (21 days).' },
  { id: 2, name: 'Basmati Rice', hindi_name: 'बासमती धान', category: 'Grains', season: 'Kharif', sowing_period: 'Jun 15 - Jul 15', harvesting_period: 'Oct 15 - Nov 30', demand: 'Very High', standard_msp: 2320.0, advisory: 'Maintain 2-3 cm water level during tillering. Pusa Basmati 1121 and 1509 command high export demand.' },
  { id: 3, name: 'Mustard', hindi_name: 'सरसों', category: 'Oilseeds', season: 'Rabi', sowing_period: 'Oct 01 - Oct 31', harvesting_period: 'Feb 15 - Mar 15', demand: 'High', standard_msp: 5650.0, advisory: 'Monitor for aphid outbreak. Spray Dimethoate 30 EC if more than 10 aphids per plant are observed.' },
  { id: 4, name: 'Soybean', hindi_name: 'सोयाबीन', category: 'Oilseeds', season: 'Kharif', sowing_period: 'Jun 20 - Jul 10', harvesting_period: 'Oct 01 - Oct 25', demand: 'High', standard_msp: 4892.0, advisory: 'Inoculate seed with Rhizobium culture prior to sowing for natural nitrogen fixation.' },
  { id: 5, name: 'Cotton', hindi_name: 'कपास', category: 'Cash Crops', season: 'Kharif', sowing_period: 'Apr 15 - May 15', harvesting_period: 'Oct 15 - Dec 31', demand: 'Moderate', standard_msp: 7122.0, advisory: 'Hang pheromone traps for pink bollworm detection. Balanced Potash reduces boll shedding.' },
  { id: 6, name: 'Onion', hindi_name: 'प्याज', category: 'Vegetables', season: 'Rabi', sowing_period: 'Dec 15 - Jan 15', harvesting_period: 'Apr 15 - May 30', demand: 'Very High', standard_msp: 1950.0, advisory: 'Proper curing of bulbs in shade for 7-10 days is mandatory before long-distance transport.' },
  { id: 7, name: 'Potato', hindi_name: 'आलू', category: 'Vegetables', season: 'Rabi', sowing_period: 'Oct 15 - Nov 15', harvesting_period: 'Feb 01 - Mar 15', demand: 'High', standard_msp: 1450.0, advisory: 'Apply preventive Mancozeb (2g/L) before heavy foggy weather to protect against late blight.' },
  { id: 8, name: 'Maize', hindi_name: 'मक्का', category: 'Grains', season: 'Kharif', sowing_period: 'Jun 15 - Jul 15', harvesting_period: 'Sep 15 - Oct 20', demand: 'High', standard_msp: 2090.0, advisory: 'Scout leaf whorls for Fall Armyworm caterpillars; apply neem-based biopesticide at emergence.' }
];

export const INITIAL_MANDIS: Mandi[] = [
  { id: 1, name: 'Khanna Grain Market', location: 'Khanna, Ludhiana', state: 'Punjab', contact_number: '01628-223344' },
  { id: 2, name: 'Azadpur APMC Mandi', location: 'North Delhi', state: 'Delhi NCR', contact_number: '011-27691234' },
  { id: 3, name: 'Indore Choithram Mandi', location: 'Indore', state: 'Madhya Pradesh', contact_number: '0731-2445566' },
  { id: 4, name: 'Vashi APMC Market', location: 'Navi Mumbai', state: 'Maharashtra', contact_number: '022-27889900' },
  { id: 5, name: 'Karnal New Grain Market', location: 'Karnal', state: 'Haryana', contact_number: '0184-225566' }
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  { id: 1, crop_id: 1, crop_name: 'Wheat', mandi_id: 1, mandi_name: 'Khanna Grain Market', mandi_location: 'Khanna, Ludhiana', mandi_state: 'Punjab', min_price: 2275, max_price: 2490, modal_price: 2420, trend: 'up', date: '2026-09-15' },
  { id: 2, crop_id: 1, crop_name: 'Wheat', mandi_id: 2, mandi_name: 'Azadpur APMC Mandi', mandi_location: 'North Delhi', mandi_state: 'Delhi NCR', min_price: 2350, max_price: 2560, modal_price: 2480, trend: 'up', date: '2026-09-15' },
  { id: 3, crop_id: 1, crop_name: 'Wheat', mandi_id: 5, mandi_name: 'Karnal New Grain Market', mandi_location: 'Karnal', mandi_state: 'Haryana', min_price: 2300, max_price: 2460, modal_price: 2390, trend: 'stable', date: '2026-09-15' },
  { id: 4, crop_id: 2, crop_name: 'Basmati Rice', mandi_id: 1, mandi_name: 'Khanna Grain Market', mandi_location: 'Khanna, Ludhiana', mandi_state: 'Punjab', min_price: 3400, max_price: 3920, modal_price: 3750, trend: 'up', date: '2026-09-15' },
  { id: 5, crop_id: 2, crop_name: 'Basmati Rice', mandi_id: 2, mandi_name: 'Azadpur APMC Mandi', mandi_location: 'North Delhi', mandi_state: 'Delhi NCR', min_price: 3600, max_price: 4100, modal_price: 3890, trend: 'up', date: '2026-09-15' },
  { id: 6, crop_id: 3, crop_name: 'Mustard', mandi_id: 5, mandi_name: 'Karnal New Grain Market', mandi_location: 'Karnal', mandi_state: 'Haryana', min_price: 5400, max_price: 5950, modal_price: 5780, trend: 'up', date: '2026-09-15' },
  { id: 7, crop_id: 3, crop_name: 'Mustard', mandi_id: 2, mandi_name: 'Azadpur APMC Mandi', mandi_location: 'North Delhi', mandi_state: 'Delhi NCR', min_price: 5500, max_price: 6020, modal_price: 5840, trend: 'stable', date: '2026-09-15' },
  { id: 8, crop_id: 4, crop_name: 'Soybean', mandi_id: 3, mandi_name: 'Indore Choithram Mandi', mandi_location: 'Indore', mandi_state: 'Madhya Pradesh', min_price: 4700, max_price: 5250, modal_price: 5080, trend: 'up', date: '2026-09-15' },
  { id: 9, crop_id: 6, crop_name: 'Onion', mandi_id: 4, mandi_name: 'Vashi APMC Market', mandi_location: 'Navi Mumbai', mandi_state: 'Maharashtra', min_price: 1900, max_price: 2450, modal_price: 2240, trend: 'down', date: '2026-09-15' },
  { id: 10, crop_id: 6, crop_name: 'Onion', mandi_id: 2, mandi_name: 'Azadpur APMC Mandi', mandi_location: 'North Delhi', mandi_state: 'Delhi NCR', min_price: 2100, max_price: 2680, modal_price: 2450, trend: 'up', date: '2026-09-15' },
  { id: 11, crop_id: 5, crop_name: 'Cotton', mandi_id: 5, mandi_name: 'Karnal New Grain Market', mandi_location: 'Karnal', mandi_state: 'Haryana', min_price: 6900, max_price: 7400, modal_price: 7210, trend: 'stable', date: '2026-09-15' }
];

export const INITIAL_BUYERS: Buyer[] = [
  { id: 1, name: 'Vikas Aggarwal', business_name: 'ITC e-Choupal Sourcing Hub', location: 'Khanna, Punjab', verified: true, phone: '+91 98721 00123', rating: 4.9, reviews_count: 48 },
  { id: 2, name: 'Sunil Singhania', business_name: 'Adani Agri Agro Foods Ltd', location: 'Panipat, Haryana', verified: true, phone: '+91 99912 34567', rating: 4.8, reviews_count: 36 },
  { id: 3, name: 'Rajesh Deshmukh', business_name: 'BigBasket Farm-to-Fork Direct', location: 'Vashi APMC, Mumbai', verified: true, phone: '+91 98200 45678', rating: 4.7, reviews_count: 52 },
  { id: 4, name: 'Amitabh Shrivastava', business_name: 'Kisan Sanyog Agro Traders', location: 'Indore, Madhya Pradesh', verified: true, phone: '+91 94250 11223', rating: 4.6, reviews_count: 29 },
  { id: 5, name: 'Kailash Chand', business_name: 'AgroStar Procurement Hub', location: 'Karnal, Haryana', verified: false, phone: '+91 98120 77889', rating: 4.3, reviews_count: 14 }
];

export const INITIAL_BUYER_OFFERS: BuyerOffer[] = [
  {
    id: 1,
    buyer_id: 1,
    buyer_name: 'Vikas Aggarwal',
    business_name: 'ITC e-Choupal Sourcing Hub',
    buyer_location: 'Khanna, Punjab',
    buyer_verified: true,
    buyer_phone: '+91 98721 00123',
    buyer_rating: 4.9,
    crop_id: 1,
    crop_name: 'Wheat',
    price: 2480,
    quantity: 150,
    payment_terms: 'Instant NEFT / IMPS upon electronic weighment',
    distance_km: 18.5,
    created_at: '2026-09-14'
  },
  {
    id: 2,
    buyer_id: 2,
    buyer_name: 'Sunil Singhania',
    business_name: 'Adani Agri Agro Foods Ltd',
    buyer_location: 'Panipat, Haryana',
    buyer_verified: true,
    buyer_phone: '+91 99912 34567',
    buyer_rating: 4.8,
    crop_id: 1,
    crop_name: 'Wheat',
    price: 2510,
    quantity: 300,
    payment_terms: 'Direct 24-Hour RTGS to farmer Jan Dhan / Savings account',
    distance_km: 34.0,
    created_at: '2026-09-15'
  },
  {
    id: 3,
    buyer_id: 1,
    buyer_name: 'Vikas Aggarwal',
    business_name: 'ITC e-Choupal Sourcing Hub',
    buyer_location: 'Khanna, Punjab',
    buyer_verified: true,
    buyer_phone: '+91 98721 00123',
    buyer_rating: 4.9,
    crop_id: 2,
    crop_name: 'Basmati Rice',
    price: 3880,
    quantity: 120,
    payment_terms: '50% on weighbridge slip, balance 50% in 24 hours',
    distance_km: 22.0,
    created_at: '2026-09-13'
  },
  {
    id: 4,
    buyer_id: 2,
    buyer_name: 'Sunil Singhania',
    business_name: 'Adani Agri Agro Foods Ltd',
    buyer_location: 'Panipat, Haryana',
    buyer_verified: true,
    buyer_phone: '+91 99912 34567',
    buyer_rating: 4.8,
    crop_id: 3,
    crop_name: 'Mustard',
    price: 5920,
    quantity: 80,
    payment_terms: 'Instant online settlement on moisture test clearance',
    distance_km: 28.0,
    created_at: '2026-09-14'
  },
  {
    id: 5,
    buyer_id: 3,
    buyer_name: 'Rajesh Deshmukh',
    business_name: 'BigBasket Farm-to-Fork Direct',
    buyer_location: 'Vashi APMC, Mumbai',
    buyer_verified: true,
    buyer_phone: '+91 98200 45678',
    buyer_rating: 4.7,
    crop_id: 6,
    crop_name: 'Onion',
    price: 2320,
    quantity: 200,
    payment_terms: 'Instant UPI / Direct IMPS payment at unloading gate',
    distance_km: 42.0,
    created_at: '2026-09-15'
  },
  {
    id: 6,
    buyer_id: 4,
    buyer_name: 'Amitabh Shrivastava',
    business_name: 'Kisan Sanyog Agro Traders',
    buyer_location: 'Indore, Madhya Pradesh',
    buyer_verified: true,
    buyer_phone: '+91 94250 11223',
    buyer_rating: 4.6,
    crop_id: 4,
    crop_name: 'Soybean',
    price: 5180,
    quantity: 100,
    payment_terms: 'Instant Cash or UPI on dispatch verification',
    distance_km: 15.0,
    created_at: '2026-09-12'
  },
  {
    id: 7,
    buyer_id: 5,
    buyer_name: 'Kailash Chand',
    business_name: 'AgroStar Procurement Hub',
    buyer_location: 'Karnal, Haryana',
    buyer_verified: false,
    buyer_phone: '+91 98120 77889',
    buyer_rating: 4.3,
    crop_id: 5,
    crop_name: 'Cotton',
    price: 7350,
    quantity: 90,
    payment_terms: 'Payment by Cheque / 48-Hour Bank Clearance',
    distance_km: 50.0,
    created_at: '2026-09-14'
  },
  {
    id: 8,
    buyer_id: 3,
    buyer_name: 'Rajesh Deshmukh',
    business_name: 'BigBasket Farm-to-Fork Direct',
    buyer_location: 'Khanna Regional Depot',
    buyer_verified: true,
    buyer_phone: '+91 98200 45678',
    buyer_rating: 4.7,
    crop_id: 1,
    crop_name: 'Wheat',
    price: 2495,
    quantity: 180,
    payment_terms: 'Direct bank transfer within 4 hours of unloading',
    distance_km: 26.5,
    created_at: '2026-09-15'
  }
];

export const INITIAL_TRANSPORTERS: TransportProvider[] = [
  {
    id: 1,
    name: 'Harpreet Singh',
    phone: '+91 98141 23456',
    vehicle_type: 'Mini Truck (Tata 407)',
    vehicle_number: 'PB 10 CQ 4512',
    capacity: 40,
    capacity_unit: 'Quintals',
    start_location: 'Ludhiana / Doraha',
    destination: 'Khanna Mandi',
    rate_per_km: 14.0,
    availability: 'Available Today',
    verified: true,
    rating: 4.9,
    completed_trips: 74
  },
  {
    id: 2,
    name: 'Gurdeep Gill',
    phone: '+91 98762 33445',
    vehicle_type: 'Pickup (Bolero Maxi Truck)',
    vehicle_number: 'PB 08 BX 8891',
    capacity: 20,
    capacity_unit: 'Quintals',
    start_location: 'Jalandhar / Phagwara',
    destination: 'Azadpur Delhi Mandi',
    rate_per_km: 11.5,
    availability: 'Available Today',
    verified: true,
    rating: 4.8,
    completed_trips: 92
  },
  {
    id: 3,
    name: 'Rajinder Yadav',
    phone: '+91 94160 55667',
    vehicle_type: '10-Wheeler Heavy Truck',
    vehicle_number: 'HR 38 Y 1209',
    capacity: 150,
    capacity_unit: 'Quintals',
    start_location: 'Karnal / Panipat',
    destination: 'Azadpur APMC Delhi',
    rate_per_km: 26.0,
    availability: 'Available Tomorrow',
    verified: true,
    rating: 4.7,
    completed_trips: 130
  },
  {
    id: 4,
    name: 'Baldev Sandhu',
    phone: '+91 98880 11992',
    vehicle_type: 'Tractor Trolley (Hydraulic)',
    vehicle_number: 'PB 11 T 3044',
    capacity: 50,
    capacity_unit: 'Quintals',
    start_location: 'Samrala / Khanna',
    destination: 'Khanna Grain Market',
    rate_per_km: 9.5,
    availability: 'Available Today',
    verified: true,
    rating: 4.9,
    completed_trips: 58
  },
  {
    id: 5,
    name: 'Sachin Shinde',
    phone: '+91 98223 77110',
    vehicle_type: 'Pickup (Mahindra Bolero)',
    vehicle_number: 'MH 15 AG 7821',
    capacity: 25,
    capacity_unit: 'Quintals',
    start_location: 'Nashik / Niphad',
    destination: 'Vashi APMC Navi Mumbai',
    rate_per_km: 12.0,
    availability: 'Available Today',
    verified: true,
    rating: 4.8,
    completed_trips: 65
  }
];

export const INITIAL_SHARED_TRIPS: SharedTransport[] = [
  {
    id: 1,
    farmer_id: 101,
    organizer_name: 'Harbhajan Singh',
    organizer_mobile: '9876543210',
    start_village: 'Kishanpur Village (Doraha)',
    destination: 'Khanna Grain Market',
    travel_date: 'Tomorrow, 06:00 AM',
    vehicle_type: 'Mini Truck (Tata 407)',
    total_capacity: 40,
    available_capacity: 22,
    total_cost: 2400,
    status: 'Open',
    participating_count: 2,
    cost_per_quintal: 60,
    members: [
      { id: 1, shared_transport_id: 1, farmer_id: 101, farmer_name: 'Harbhajan Singh (Organizer)', booked_quantity: 18, share_amount: 1080 }
    ]
  },
  {
    id: 2,
    farmer_id: 103,
    organizer_name: 'Dharmendra Singh',
    organizer_mobile: '9412345678',
    start_village: 'Rampur / Daurala Hub',
    destination: 'Azadpur APMC Delhi',
    travel_date: 'In 2 Days, 04:30 AM',
    vehicle_type: 'Eicher Pro 1110 (Medium Truck)',
    total_capacity: 90,
    available_capacity: 45,
    total_cost: 6300,
    status: 'Open',
    participating_count: 2,
    cost_per_quintal: 70,
    members: [
      { id: 2, shared_transport_id: 2, farmer_id: 103, farmer_name: 'Dharmendra Singh (Organizer)', booked_quantity: 45, share_amount: 3150 }
    ]
  }
];

export const INITIAL_ADVISORY: CropAdvisoryItem[] = [
  {
    id: 1,
    crop: 'Wheat',
    hindi_name: 'गेहूं',
    season: 'Rabi',
    sowing_period: 'Nov 01 - Dec 15',
    harvesting_period: 'Mar 15 - Apr 30',
    market_demand: 'Very High',
    standard_msp: 2275.0,
    crop_info: 'Wheat is India\'s staple cereal requiring a cool winter climate and mild warmth during ripening. Best suited varieties include HD-2967, PBW-550, and DBW-187 with potential yield of 22-25 quintals/acre.',
    regional_tip: 'Apply Zinc Sulphate @ 10 kg/acre if leaves show chlorosis. Timely sowing saves crop from terminal heat in March.',
    irrigation: '4 to 5 irrigations required: CRI stage (21 days), Tillering (40-45 days), Late jointing (60-65 days), Flowering (80-85 days), and Milking (100-105 days).',
    pest_management: 'Yellow rust prevention: Inspect field weekly. On noticing yellow dust on leaves, spray Propiconazole 25% EC @ 200 ml in 200 liters of water per acre.'
  },
  {
    id: 2,
    crop: 'Basmati Rice',
    hindi_name: 'बासमती धान',
    season: 'Kharif',
    sowing_period: 'Jun 15 - Jul 15',
    harvesting_period: 'Oct 15 - Nov 30',
    market_demand: 'Very High',
    standard_msp: 2320.0,
    crop_info: 'Premium export-grade long aromatic rice. Varieties like Pusa Basmati 1121, 1509, and 1718 command 30-50% market premium over non-basmati varieties in mandis.',
    regional_tip: 'Direct Seeded Rice (DSR) using Tar-Vattar method saves up to 20% groundwater and ₹3,500/acre in labor costs.',
    irrigation: 'Keep standing water (2-3 cm) during first 15 days after transplanting; alternate wetting and drying saves electricity and water.',
    pest_management: 'Control stem borer using Cartap Hydrochloride 4G granules @ 10 kg/acre at 30 days after transplanting.'
  },
  {
    id: 3,
    crop: 'Mustard',
    hindi_name: 'सरसों',
    season: 'Rabi',
    sowing_period: 'Oct 01 - Oct 31',
    harvesting_period: 'Feb 15 - Mar 15',
    market_demand: 'High',
    standard_msp: 5650.0,
    crop_info: 'High-oil content cash crop requiring minimal irrigation (1-2 cycles). Recommended varieties include Pusa Bold, Giriraj, and RH-749 yielding 8-10 quintals/acre.',
    regional_tip: 'Thinning is crucial at 15-20 days after germination to maintain 10-12 cm spacing between plants for robust branching.',
    irrigation: 'First irrigation at pre-flowering stage (30-35 DAS) and second at pod formation (60-65 DAS). Avoid water stagnation.',
    pest_management: 'Mustard aphid poses serious risk in cloudy weather. Spray Oxydemeton-methyl 25 EC or Dimethoate 30 EC if threshold exceeds.'
  },
  {
    id: 4,
    crop: 'Soybean',
    hindi_name: 'सोयाबीन',
    season: 'Kharif',
    sowing_period: 'Jun 20 - Jul 10',
    harvesting_period: 'Oct 01 - Oct 25',
    market_demand: 'High',
    standard_msp: 4892.0,
    crop_info: 'Rich source of protein (40%) and oil (20%). Varieties JS-9560, JS-2034, and NRC-37 are popular for high disease resistance.',
    regional_tip: 'Inoculate seed with Rhizobium japonicum and PSB culture @ 5g/kg seed for robust root nodulation.',
    irrigation: 'Critical during flowering and pod development stages. Provide protective irrigation if dry spell exceeds 12-14 days.',
    pest_management: 'Control semilooper and girdle beetle with Chlorantraniliprole 18.5% SC @ 60 ml/acre.'
  },
  {
    id: 5,
    crop: 'Cotton',
    hindi_name: 'कपास',
    season: 'Kharif',
    sowing_period: 'Apr 15 - May 15',
    harvesting_period: 'Oct 15 - Dec 31',
    market_demand: 'Moderate',
    standard_msp: 7122.0,
    crop_info: 'White gold commercial cash crop. Requires deep well-drained black or alluvial soil with high moisture retention.',
    regional_tip: 'Install 5 pheromone traps per acre at 45 days after sowing to monitor pink bollworm moth activity.',
    irrigation: 'Avoid excessive watering during vegetative stage to curb unnecessary vegetative growth; maintain moderate moisture at boll development.',
    pest_management: 'Use Neem oil (1500 ppm) early. For whitefly control, spray Flonicamid 50 WG @ 60 g/acre.'
  },
  {
    id: 6,
    crop: 'Onion',
    hindi_name: 'प्याज',
    season: 'Rabi',
    sowing_period: 'Dec 15 - Jan 15',
    harvesting_period: 'Apr 15 - May 30',
    market_demand: 'Very High',
    standard_msp: 1950.0,
    crop_info: 'High-value horticultural crop with strong year-round mandi and export demand. Prominent varieties: Bhima Super, AgriFound Dark Red.',
    regional_tip: 'Stop irrigation 10-15 days before harvest to improve bulb keeping quality and shelf life.',
    irrigation: 'Frequent light irrigations at 7-10 days interval; drip fertigation increases bulb size by 25%.',
    pest_management: 'Thrips cause silvery patches on foliage. Spray Fipronil 5% SC @ 2 ml/L or Thiamethoxam 25% WG.'
  }
];
