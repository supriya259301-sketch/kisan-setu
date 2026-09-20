import os
import sys
from datetime import date, datetime, timedelta

# Ensure backend package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.app import create_app
from backend.models import db
from backend.models.farmer import Farmer
from backend.models.buyer import Buyer, BuyerOffer
from backend.models.crop import Crop
from backend.models.mandi import Mandi, MarketPrice
from backend.models.transport import TransportProvider, SharedTransport, SharedTransportMember

def seed_database():
    app = create_app()
    with app.app_context():
        print("Initializing database tables...")
        db.create_all()

        # Check if already seeded
        if Farmer.query.first():
            print("Database already contains data. Skipping seed.")
            return

        print("Seeding Crops...")
        crops_data = [
            Crop(name='Wheat', hindi_name='गेहूं', category='Grains', season='Rabi', sowing_period='Nov 01 - Dec 15', harvesting_period='Mar 15 - Apr 30', demand='Very High', standard_msp=2275.0, advisory='Sow HD-2967 or PBW-550 varieties. First irrigation strictly at CRI stage (21 days).'),
            Crop(name='Basmati Rice', hindi_name='बासमती धान', category='Grains', season='Kharif', sowing_period='Jun 15 - Jul 15', harvesting_period='Oct 15 - Nov 30', demand='Very High', standard_msp=2320.0, advisory='Maintain 2-3 cm water level during tillering. Use Pusa Basmati 1121 or 1509 for higher market premium.'),
            Crop(name='Mustard', hindi_name='सरसों', category='Oilseeds', season='Rabi', sowing_period='Oct 01 - Oct 31', harvesting_period='Feb 15 - Mar 15', demand='High', standard_msp=5650.0, advisory='Spray Dimethoate 30 EC if aphid population exceeds 10 per plant. Avoid waterlogging.'),
            Crop(name='Soybean', hindi_name='सोयाबीन', category='Oilseeds', season='Kharif', sowing_period='Jun 20 - Jul 10', harvesting_period='Oct 01 - Oct 25', demand='High', standard_msp=4892.0, advisory='Inoculate seeds with Rhizobium culture before sowing for natural nitrogen fixation.'),
            Crop(name='Cotton', hindi_name='कपास', category='Cash Crops', season='Kharif', sowing_period='Apr 15 - May 15', harvesting_period='Oct 15 - Dec 31', demand='Moderate', standard_msp=7122.0, advisory='Install pheromone traps for pink bollworm monitoring; avoid excessive urea application.'),
            Crop(name='Onion', hindi_name='प्याज', category='Vegetables', season='Rabi', sowing_period='Dec 15 - Jan 15', harvesting_period='Apr 15 - May 30', demand='Very High', standard_msp=1950.0, advisory='Cure bulbs under shade for 7-10 days before transport or cold storage storage.'),
            Crop(name='Potato', hindi_name='आलू', category='Vegetables', season='Rabi', sowing_period='Oct 15 - Nov 15', harvesting_period='Feb 01 - Mar 15', demand='High', standard_msp=1450.0, advisory='Spray Mancozeb (2g/L) for preventive management of late blight disease.'),
            Crop(name='Maize', hindi_name='मक्का', category='Grains', season='Kharif', sowing_period='Jun 15 - Jul 15', harvesting_period='Sep 15 - Oct 20', demand='High', standard_msp=2090.0, advisory='Apply balanced potash to prevent lodging; scout for Fall Armyworm.')
        ]
        db.session.add_all(crops_data)
        db.session.commit()

        print("Seeding Farmers...")
        f1 = Farmer(
            name='Ramesh Kumar',
            mobile='9876543210',
            email='ramesh.farmer@kisansetu.in',
            village='Kishanpur',
            district='Ludhiana',
            state='Punjab',
            language='pa',
            farm_size_acres=8.5
        )
        f1.set_password('kisan123')

        f2 = Farmer(
            name='Suresh Patil',
            mobile='9811223344',
            email='suresh.patil@kisansetu.in',
            village='Shivnagar',
            district='Nashik',
            state='Maharashtra',
            language='mr',
            farm_size_acres=5.0
        )
        f2.set_password('kisan123')

        f3 = Farmer(
            name='Dharmendra Singh',
            mobile='9412345678',
            email='dharmendra.singh@kisansetu.in',
            village='Rampur',
            district='Meerut',
            state='Uttar Pradesh',
            language='hi',
            farm_size_acres=6.2
        )
        f3.set_password('kisan123')
        db.session.add_all([f1, f2, f3])
        db.session.commit()

        print("Seeding Buyers & Offers...")
        b1 = Buyer(name='Vikas Aggarwal', business_name='ITC e-Choupal Direct Sourcing', location='Khanna, Punjab', verified=True, phone='+91 98721 00123', rating=4.9, reviews_count=48)
        b2 = Buyer(name='Sunil Singhania', business_name='Adani Agri Agro Foods Ltd', location='Panipat, Haryana', verified=True, phone='+91 99912 34567', rating=4.8, reviews_count=36)
        b3 = Buyer(name='Rajesh Deshmukh', business_name='BigBasket Farm-to-Fork Direct', location='Vashi APMC, Mumbai', verified=True, phone='+91 98200 45678', rating=4.7, reviews_count=52)
        b4 = Buyer(name='Amitabh Shrivastava', business_name='Kisan Sanyog Agro Traders', location='Indore, Madhya Pradesh', verified=True, phone='+91 94250 11223', rating=4.6, reviews_count=29)
        b5 = Buyer(name='Kailash Chand', business_name='AgroStar Procurement Hub', location='Karnal, Haryana', verified=False, phone='+91 98120 77889', rating=4.3, reviews_count=14)

        db.session.add_all([b1, b2, b3, b4, b5])
        db.session.commit()

        wheat = Crop.query.filter_by(name='Wheat').first()
        rice = Crop.query.filter_by(name='Basmati Rice').first()
        mustard = Crop.query.filter_by(name='Mustard').first()
        onion = Crop.query.filter_by(name='Onion').first()
        soybean = Crop.query.filter_by(name='Soybean').first()
        cotton = Crop.query.filter_by(name='Cotton').first()

        offers = [
            BuyerOffer(buyer_id=b1.id, crop_id=wheat.id, price=2450.0, quantity=150.0, payment_terms='Instant NEFT / IMPS upon quality check', distance_km=18.5),
            BuyerOffer(buyer_id=b2.id, crop_id=wheat.id, price=2480.0, quantity=300.0, payment_terms='24-Hour RTGS direct to Jan Dhan Account', distance_km=34.0),
            BuyerOffer(buyer_id=b1.id, crop_id=rice.id, price=3850.0, quantity=120.0, payment_terms='50% on weighbridge, 50% within 2 days', distance_km=22.0),
            BuyerOffer(buyer_id=b2.id, crop_id=mustard.id, price=5920.0, quantity=80.0, payment_terms='Same-day bank settlement', distance_km=28.0),
            BuyerOffer(buyer_id=b3.id, crop_id=onion.id, price=2300.0, quantity=200.0, payment_terms='Instant UPI / Direct Account Credit', distance_km=42.0),
            BuyerOffer(buyer_id=b4.id, crop_id=soybean.id, price=5150.0, quantity=100.0, payment_terms='Instant Cash / UPI at gate', distance_km=15.0),
            BuyerOffer(buyer_id=b5.id, crop_id=cotton.id, price=7350.0, quantity=90.0, payment_terms='48-Hour Bank Clearance', distance_km=50.0),
            BuyerOffer(buyer_id=b3.id, crop_id=wheat.id, price=2510.0, quantity=180.0, payment_terms='Immediate digital payment via Kisan Portal', distance_km=25.0)
        ]
        db.session.add_all(offers)
        db.session.commit()

        print("Seeding Mandis & Market Prices...")
        m1 = Mandi(name='Khanna Grain Market', location='Khanna, Ludhiana', state='Punjab', contact_number='01628-223344')
        m2 = Mandi(name='Azadpur APMC Mandi', location='New Delhi', state='Delhi NCR', contact_number='011-27691234')
        m3 = Mandi(name='Indore Choithram Mandi', location='Indore', state='Madhya Pradesh', contact_number='0731-2445566')
        m4 = Mandi(name='Vashi APMC Market', location='Navi Mumbai', state='Maharashtra', contact_number='022-27889900')
        m5 = Mandi(name='Karnal New Grain Market', location='Karnal', state='Haryana', contact_number='0184-225566')

        db.session.add_all([m1, m2, m3, m4, m5])
        db.session.commit()

        today = date.today()
        market_prices_data = [
            MarketPrice(crop_id=wheat.id, mandi_id=m1.id, min_price=2275.0, max_price=2490.0, modal_price=2420.0, date=today, trend='up'),
            MarketPrice(crop_id=wheat.id, mandi_id=m2.id, min_price=2350.0, max_price=2560.0, modal_price=2480.0, date=today, trend='up'),
            MarketPrice(crop_id=wheat.id, mandi_id=m5.id, min_price=2300.0, max_price=2460.0, modal_price=2390.0, date=today, trend='stable'),
            MarketPrice(crop_id=rice.id, mandi_id=m1.id, min_price=3400.0, max_price=3920.0, modal_price=3750.0, date=today, trend='up'),
            MarketPrice(crop_id=rice.id, mandi_id=m2.id, min_price=3600.0, max_price=4100.0, modal_price=3890.0, date=today, trend='up'),
            MarketPrice(crop_id=mustard.id, mandi_id=m5.id, min_price=5400.0, max_price=5950.0, modal_price=5780.0, date=today, trend='up'),
            MarketPrice(crop_id=mustard.id, mandi_id=m2.id, min_price=5500.0, max_price=6020.0, modal_price=5840.0, date=today, trend='stable'),
            MarketPrice(crop_id=soybean.id, mandi_id=m3.id, min_price=4700.0, max_price=5250.0, modal_price=5080.0, date=today, trend='up'),
            MarketPrice(crop_id=onion.id, mandi_id=m4.id, min_price=1900.0, max_price=2450.0, modal_price=2240.0, date=today, trend='down'),
            MarketPrice(crop_id=onion.id, mandi_id=m2.id, min_price=2100.0, max_price=2680.0, modal_price=2450.0, date=today, trend='up'),
            MarketPrice(crop_id=cotton.id, mandi_id=m5.id, min_price=6900.0, max_price=7400.0, modal_price=7210.0, date=today, trend='stable')
        ]
        db.session.add_all(market_prices_data)
        db.session.commit()

        print("Seeding Transport Providers...")
        transporters = [
            TransportProvider(name='Harpreet Singh', phone='+91 98141 23456', vehicle_type='Mini Truck (Tata 407)', vehicle_number='PB 10 CQ 4512', capacity=40.0, start_location='Ludhiana', destination='Khanna Mandi', rate_per_km=14.0, availability='Available Today', verified=True, rating=4.9, completed_trips=74),
            TransportProvider(name='Gurdeep Gill', phone='+91 98762 33445', vehicle_type='Pickup (Bolero Maxi)', vehicle_number='PB 08 BX 8891', capacity=20.0, start_location='Jalandhar', destination='Azadpur Delhi', rate_per_km=11.5, availability='Available Today', verified=True, rating=4.8, completed_trips=92),
            TransportProvider(name='Rajinder Yadav', phone='+91 94160 55667', vehicle_type='10-Wheeler Heavy Truck', vehicle_number='HR 38 Y 1209', capacity=150.0, start_location='Karnal', destination='Azadpur APMC', rate_per_km=26.0, availability='Available Tomorrow', verified=True, rating=4.7, completed_trips=130),
            TransportProvider(name='Baldev Sandhu', phone='+91 98880 11992', vehicle_type='Tractor Trolley (Hydraulic)', vehicle_number='PB 11 T 3044', capacity=50.0, start_location='Samrala', destination='Khanna Mandi', rate_per_km=9.0, availability='Available Today', verified=True, rating=4.9, completed_trips=58),
            TransportProvider(name='Sachin Shinde', phone='+91 98223 77110', vehicle_type='Pickup (Mahindra Bolero)', vehicle_number='MH 15 AG 7821', capacity=25.0, start_location='Nashik', destination='Vashi APMC', rate_per_km=12.0, availability='Available Today', verified=True, rating=4.8, completed_trips=65)
        ]
        db.session.add_all(transporters)
        db.session.commit()

        print("Seeding Shared Transport Trips...")
        tomorrow_str = (date.today() + timedelta(days=1)).strftime('%Y-%m-%d')
        day_after_str = (date.today() + timedelta(days=2)).strftime('%Y-%m-%d')

        st1 = SharedTransport(
            farmer_id=f1.id,
            start_village='Kishanpur / Doraha',
            destination='Khanna Grain Market',
            travel_date=tomorrow_str,
            vehicle_type='Mini Truck (40 Qtl)',
            total_capacity=40.0,
            available_capacity=22.0,
            total_cost=2400.0,
            status='Open'
        )
        db.session.add(st1)
        db.session.commit()

        # Members in trip 1
        m_st1 = SharedTransportMember(
            shared_transport_id=st1.id,
            farmer_id=f1.id,
            farmer_name=f1.name,
            booked_quantity=18.0,
            share_amount=1080.0
        )
        db.session.add(m_st1)

        st2 = SharedTransport(
            farmer_id=f3.id,
            start_village='Rampur / Daurala',
            destination='Azadpur APMC Delhi',
            travel_date=day_after_str,
            vehicle_type='Eicher Pro 1110 (90 Qtl)',
            total_capacity=90.0,
            available_capacity=45.0,
            total_cost=6500.0,
            status='Open'
        )
        db.session.add(st2)
        db.session.commit()

        m_st2 = SharedTransportMember(
            shared_transport_id=st2.id,
            farmer_id=f3.id,
            farmer_name=f3.name,
            booked_quantity=45.0,
            share_amount=3250.0
        )
        db.session.add(m_st2)
        db.session.commit()

        print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed_database()
