from ..models.transport import SharedTransport, SharedTransportMember
from ..models.farmer import Farmer
from ..models import db

class TransportService:
    @staticmethod
    def get_shared_trips(destination=None, date=None):
        query = SharedTransport.query.filter(SharedTransport.status != 'Cancelled')
        if destination:
            query = query.filter(SharedTransport.destination.ilike(f"%{destination}%"))
        if date:
            query = query.filter(SharedTransport.travel_date == date)
        
        trips = query.order_by(SharedTransport.id.desc()).all()
        return [t.to_dict() for t in trips]

    @staticmethod
    def create_shared_trip(farmer_id, data):
        farmer = Farmer.query.get(farmer_id)
        if not farmer:
            return {'error': 'Farmer not found'}, 404

        start_village = data.get('start_village', farmer.village)
        destination = data.get('destination')
        travel_date = data.get('travel_date')
        vehicle_type = data.get('vehicle_type', 'Mini Truck (40 Qtl)')
        total_capacity = float(data.get('total_capacity', 40.0))
        farmer_load = float(data.get('farmer_load', 15.0))
        total_cost = float(data.get('total_cost', 3200.0))

        if not destination or not travel_date:
            return {'error': 'Destination and travel date are required'}, 400

        available_capacity = max(0.0, total_capacity - farmer_load)

        trip = SharedTransport(
            farmer_id=farmer_id,
            start_village=start_village,
            destination=destination,
            travel_date=travel_date,
            vehicle_type=vehicle_type,
            total_capacity=total_capacity,
            available_capacity=available_capacity,
            total_cost=total_cost,
            status='Open' if available_capacity > 0 else 'Full'
        )
        db.session.add(trip)
        db.session.commit()

        # Add organizer as first member with their load
        organizer_share = round((farmer_load / total_capacity) * total_cost, 2)
        initial_member = SharedTransportMember(
            shared_transport_id=trip.id,
            farmer_id=farmer_id,
            farmer_name=farmer.name,
            booked_quantity=farmer_load,
            share_amount=organizer_share
        )
        db.session.add(initial_member)
        db.session.commit()

        return trip.to_dict()

    @staticmethod
    def join_shared_trip(trip_id, farmer_id, data):
        trip = SharedTransport.query.get(trip_id)
        if not trip:
            return {'error': 'Shared trip not found'}, 404

        if trip.status == 'Full' or trip.available_capacity <= 0:
            return {'error': 'Trip is already at full capacity'}, 400

        farmer = Farmer.query.get(farmer_id)
        if not farmer:
            return {'error': 'Farmer not found'}, 404

        booked_quantity = float(data.get('quantity', 10.0))
        if booked_quantity <= 0:
            return {'error': 'Booked quantity must be greater than 0'}, 400

        if booked_quantity > trip.available_capacity:
            return {
                'error': f'Requested quantity ({booked_quantity} Qtl) exceeds available capacity ({trip.available_capacity} Qtl)'
            }, 400

        # Calculate fair share of total cost
        share_amount = round((booked_quantity / trip.total_capacity) * trip.total_cost, 2)
        
        # Calculate solo cost vs shared cost (Solo booking entire vehicle would cost total_cost)
        solo_cost = trip.total_cost
        estimated_savings = round(solo_cost - share_amount, 2)

        member = SharedTransportMember(
            shared_transport_id=trip.id,
            farmer_id=farmer_id,
            farmer_name=farmer.name,
            booked_quantity=booked_quantity,
            share_amount=share_amount
        )
        trip.available_capacity = round(trip.available_capacity - booked_quantity, 2)
        if trip.available_capacity <= 0:
            trip.status = 'Full'

        db.session.add(member)
        db.session.commit()

        return {
            'success': True,
            'message': f'Successfully joined trip to {trip.destination}!',
            'trip': trip.to_dict(),
            'share_amount': share_amount,
            'estimated_savings': estimated_savings
        }
