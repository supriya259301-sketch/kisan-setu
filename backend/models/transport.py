from . import db
from datetime import datetime

class TransportProvider(db.Model):
    __tablename__ = 'transport_providers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    vehicle_type = db.Column(db.String(50), nullable=False)  # Pickup, Mini Truck, 10-Wheeler, Tractor Trolley
    vehicle_number = db.Column(db.String(30), nullable=True)
    capacity = db.Column(db.Float, nullable=False)           # Quintals or Tons
    capacity_unit = db.Column(db.String(10), default='Quintals')
    start_location = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(100), nullable=False)
    rate_per_km = db.Column(db.Float, nullable=False)
    availability = db.Column(db.String(50), default='Available Today')
    verified = db.Column(db.Boolean, default=True)
    rating = db.Column(db.Float, default=4.8)
    completed_trips = db.Column(db.Integer, default=48)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'vehicle_type': self.vehicle_type,
            'vehicle_number': self.vehicle_number,
            'capacity': self.capacity,
            'capacity_unit': self.capacity_unit,
            'start_location': self.start_location,
            'destination': self.destination,
            'rate_per_km': self.rate_per_km,
            'availability': self.availability,
            'verified': self.verified,
            'rating': self.rating,
            'completed_trips': self.completed_trips
        }

class SharedTransport(db.Model):
    __tablename__ = 'shared_transports'

    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    start_village = db.Column(db.String(100), nullable=False)
    destination = db.Column(db.String(150), nullable=False)
    travel_date = db.Column(db.String(30), nullable=False)
    vehicle_type = db.Column(db.String(50), default='Mini Truck (40 Qtl)')
    total_capacity = db.Column(db.Float, nullable=False)      # in Quintals
    available_capacity = db.Column(db.Float, nullable=False)  # in Quintals
    total_cost = db.Column(db.Float, nullable=False)          # total vehicle booking cost in INR
    status = db.Column(db.String(20), default='Open')        # Open, Full, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    members = db.relationship('SharedTransportMember', backref='shared_transport', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'organizer_name': self.organizer.name if self.organizer else 'Farmer',
            'organizer_mobile': self.organizer.mobile if self.organizer else '',
            'start_village': self.start_village,
            'destination': self.destination,
            'travel_date': self.travel_date,
            'vehicle_type': self.vehicle_type,
            'total_capacity': self.total_capacity,
            'available_capacity': self.available_capacity,
            'total_cost': self.total_cost,
            'status': self.status,
            'participating_count': len(self.members) + 1,
            'cost_per_quintal': round(self.total_cost / self.total_capacity, 1) if self.total_capacity > 0 else 0,
            'members': [m.to_dict() for m in self.members],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class SharedTransportMember(db.Model):
    __tablename__ = 'shared_transport_members'

    id = db.Column(db.Integer, primary_key=True)
    shared_transport_id = db.Column(db.Integer, db.ForeignKey('shared_transports.id'), nullable=False)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    farmer_name = db.Column(db.String(100), nullable=True)
    booked_quantity = db.Column(db.Float, default=10.0) # in quintals
    share_amount = db.Column(db.Float, nullable=False)
    joined_at = db.Column(db.DateTime, default=datetime.utcnow)

    farmer = db.relationship('Farmer', backref='shared_memberships')

    def to_dict(self):
        return {
            'id': self.id,
            'shared_transport_id': self.shared_transport_id,
            'farmer_id': self.farmer_id,
            'farmer_name': self.farmer_name or (self.farmer.name if self.farmer else 'Fellow Farmer'),
            'booked_quantity': self.booked_quantity,
            'share_amount': self.share_amount,
            'joined_at': self.joined_at.isoformat() if self.joined_at else None
        }
