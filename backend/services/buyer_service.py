from ..models.buyer import Buyer, BuyerOffer
from ..models.crop import Crop
from ..models import db

class BuyerService:
    @staticmethod
    def get_all_buyers(crop_name=None, verified_only=False, search_query=None):
        query = Buyer.query
        if verified_only:
            query = query.filter_by(verified=True)
        if search_query:
            search = f"%{search_query}%"
            query = query.filter((Buyer.name.ilike(search)) | (Buyer.business_name.ilike(search)) | (Buyer.location.ilike(search)))
        
        buyers = query.all()
        return [b.to_dict() for b in buyers]

    @staticmethod
    def get_buyer_by_id(buyer_id):
        buyer = Buyer.query.get(buyer_id)
        return buyer.to_dict() if buyer else None

    @staticmethod
    def get_buyer_offers(crop_name=None, max_distance=None, sort_by='price_desc'):
        query = BuyerOffer.query.join(Buyer).join(Crop)

        if crop_name and crop_name.lower() != 'all':
            query = query.filter(Crop.name.ilike(f"%{crop_name}%"))
        
        if max_distance:
            query = query.filter(BuyerOffer.distance_km <= float(max_distance))

        if sort_by == 'price_desc':
            query = query.order_by(BuyerOffer.price.desc())
        elif sort_by == 'price_asc':
            query = query.order_by(BuyerOffer.price.asc())
        elif sort_by == 'distance_asc':
            query = query.order_by(BuyerOffer.distance_km.asc())
        elif sort_by == 'quantity_desc':
            query = query.order_by(BuyerOffer.quantity.desc())

        offers = query.all()
        return [o.to_dict() for o in offers]
