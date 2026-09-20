from . import db
from datetime import date

class Mandi(db.Model):
    __tablename__ = 'mandis'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    location = db.Column(db.String(150), nullable=False) # District / City
    state = db.Column(db.String(100), nullable=False)
    contact_number = db.Column(db.String(20), nullable=True)

    prices = db.relationship('MarketPrice', backref='mandi', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location': self.location,
            'state': self.state,
            'contact_number': self.contact_number
        }

class MarketPrice(db.Model):
    __tablename__ = 'market_prices'

    id = db.Column(db.Integer, primary_key=True)
    crop_id = db.Column(db.Integer, db.ForeignKey('crops.id'), nullable=False)
    mandi_id = db.Column(db.Integer, db.ForeignKey('mandis.id'), nullable=False)
    min_price = db.Column(db.Float, nullable=False)
    max_price = db.Column(db.Float, nullable=False)
    modal_price = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, default=date.today)
    trend = db.Column(db.String(10), default='up') # up, down, stable

    crop = db.relationship('Crop', backref='market_prices')

    def to_dict(self):
        return {
            'id': self.id,
            'crop_id': self.crop_id,
            'crop_name': self.crop.name if self.crop else '',
            'mandi_id': self.mandi_id,
            'mandi_name': self.mandi.name if self.mandi else '',
            'mandi_location': self.mandi.location if self.mandi else '',
            'mandi_state': self.mandi.state if self.mandi else '',
            'min_price': self.min_price,
            'max_price': self.max_price,
            'modal_price': self.modal_price,
            'trend': self.trend,
            'date': self.date.isoformat() if self.date else ''
        }
