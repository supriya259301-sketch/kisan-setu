from . import db

class Crop(db.Model):
    __tablename__ = 'crops'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    hindi_name = db.Column(db.String(100), nullable=True)
    category = db.Column(db.String(50), default='Grains') # Grains, Pulses, Oilseeds, Vegetables, Cash Crops
    season = db.Column(db.String(50), nullable=False)     # Kharif, Rabi, Zaid
    sowing_period = db.Column(db.String(100), nullable=False)
    harvesting_period = db.Column(db.String(100), nullable=True)
    demand = db.Column(db.String(50), default='High')      # Low, Moderate, High, Very High
    advisory = db.Column(db.Text, nullable=True)
    standard_msp = db.Column(db.Float, default=2275.0)    # Government Minimum Support Price (per quintal)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'hindi_name': self.hindi_name,
            'category': self.category,
            'season': self.season,
            'sowing_period': self.sowing_period,
            'harvesting_period': self.harvesting_period,
            'demand': self.demand,
            'advisory': self.advisory,
            'standard_msp': self.standard_msp
        }
