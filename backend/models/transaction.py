from . import db
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'

    id = db.Column(db.Integer, primary_key=True)
    farmer_id = db.Column(db.Integer, db.ForeignKey('farmers.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('buyers.id'), nullable=False)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    price = db.Column(db.Float, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='Pending') # Pending, Confirmed, Dispatched, Delivered, Completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    buyer = db.relationship('Buyer', backref='transactions')
    crop = db.relationship('Crop', backref='transactions')

    def to_dict(self):
        return {
            'id': self.id,
            'farmer_id': self.farmer_id,
            'buyer_id': self.buyer_id,
            'buyer_name': self.buyer.name if self.buyer else '',
            'crop_id': self.crop_id,
            'crop_name': self.crop.name if self.crop else '',
            'quantity': self.quantity,
            'price': self.price,
            'total_amount': self.total_amount,
            'status': self.status,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
