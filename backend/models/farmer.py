from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class Farmer(db.Model):
    __tablename__ = 'farmers'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    mobile = db.Column(db.String(15), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    village = db.Column(db.String(100), nullable=False)
    district = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    language = db.Column(db.String(20), default='en')
    farm_size_acres = db.Column(db.Float, default=5.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    shared_trips = db.relationship('SharedTransport', backref='organizer', lazy=True)
    transactions = db.relationship('Transaction', backref='farmer', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'mobile': self.mobile,
            'email': self.email,
            'village': self.village,
            'district': self.district,
            'state': self.state,
            'language': self.language,
            'farm_size_acres': self.farm_size_acres,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
