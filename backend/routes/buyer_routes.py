from flask import Blueprint, request, jsonify
from ..services.buyer_service import BuyerService
from ..models.mandi import MarketPrice, Mandi
from ..models.crop import Crop
from ..models import db

buyer_bp = Blueprint('buyers', __name__, url_prefix='/api')

@buyer_bp.route('/buyers', methods=['GET'])
def get_buyers():
    crop = request.args.get('crop')
    verified = request.args.get('verified', '').lower() == 'true'
    search = request.args.get('search')
    buyers = BuyerService.get_all_buyers(crop_name=crop, verified_only=verified, search_query=search)
    return jsonify({'success': True, 'count': len(buyers), 'buyers': buyers}), 200

@buyer_bp.route('/buyers/<int:buyer_id>', methods=['GET'])
def get_buyer(buyer_id):
    buyer = BuyerService.get_buyer_by_id(buyer_id)
    if not buyer:
        return jsonify({'error': 'Buyer not found'}), 404
    return jsonify({'success': True, 'buyer': buyer}), 200

@buyer_bp.route('/buyer-offers', methods=['GET'])
def get_buyer_offers():
    crop = request.args.get('crop')
    max_distance = request.args.get('max_distance')
    sort_by = request.args.get('sort_by', 'price_desc')
    offers = BuyerService.get_buyer_offers(crop_name=crop, max_distance=max_distance, sort_by=sort_by)
    return jsonify({'success': True, 'count': len(offers), 'offers': offers}), 200

@buyer_bp.route('/market-prices', methods=['GET'])
def get_market_prices():
    crop = request.args.get('crop')
    mandi_id = request.args.get('mandi_id')
    
    query = MarketPrice.query.join(Mandi).join(Crop)
    if crop and crop.lower() != 'all':
        query = query.filter(Crop.name.ilike(f"%{crop}%"))
    if mandi_id:
        query = query.filter(MarketPrice.mandi_id == int(mandi_id))

    prices = query.all()
    return jsonify({
        'success': True,
        'count': len(prices),
        'prices': [p.to_dict() for p in prices]
    }), 200
