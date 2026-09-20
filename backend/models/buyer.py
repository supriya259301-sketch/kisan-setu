from . import db
from datetime import datetime

class Buyer(db.Model):
    __tablename__ = 'buyers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    business_name = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    verified = db.Column(db.Boolean, default=False)
    phone = db.Column(db.String(20), nullable=True)
    rating = db.Column(db.Float, default=4.5)
    reviews_count = db.Column(db.Integer, default=12)

    offers = db.relationship('BuyerOffer', backref='buyer', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'business_name': self.business_name,
            'location': self.location,
            'verified': self.verified,
            'phone': self.phone,
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'offers': [offer.to_dict() for offer in self.offers]
        }

class BuyerOffer(db.Model):
    __tablename__ = 'buyer_offers'

    id = db.Column(db.Integer, primary_key=True)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    price = db.Column(db.Float, nullable=False)  # price per quintal / unit
    quantity = db.Column(db.Float, nullable=False) # quintals required
    payment_terms = db.Column(db.String(100), default='Immediate Bank Transfer')
    distance_km = db.Column(db.Float, default=15.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    crop = db.relationship('Crop', backref='buyer_offers')

    def to_dict(self):
        return {
            'id': self.id,
            'buyer_id': self.buyer_id,
            'buyer_name': self.buyer.name if self.buyer else '',
            'business_name': self.buyer.business_name if self.buyer else '',
            'buyer_location': self.buyer.location if self.buyer else '',
            'buyer_verified': self.buyer.verified if self.buyer else False,
            'buyer_phone': self.buyer.phone if self.buyer else '',
            'buyer_rating': self.buyer.rating if self.buyer else 4.5,
            'crop_id': self.crop_id,
            'crop_name': self.crop.name if self.crop else '',
            'price': self.price,
            'quantity': self.quantity,
            'payment_terms': self.payment_terms,
            'distance_km': self.distance_km,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
