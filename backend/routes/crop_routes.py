from flask import Blueprint, request, jsonify
from ..services.crop_advisory_service import CropAdvisoryService
from ..models.crop import Crop
from ..models.mandi import Mandi

crop_bp = Blueprint('crops', __name__, url_prefix='/api')

@crop_bp.route('/crop-advisory', methods=['GET'])
def get_crop_advisory():
    location = request.args.get('location')
    season = request.args.get('season')
    crop_name = request.args.get('crop')
    advisory = CropAdvisoryService.get_advisory(location=location, season=season, crop_name=crop_name)
    return jsonify({'success': True, 'count': len(advisory), 'advisory': advisory}), 200

@crop_bp.route('/crops', methods=['GET'])
def get_all_crops():
    crops = Crop.query.all()
    return jsonify({'success': True, 'crops': [c.to_dict() for c in crops]}), 200

@crop_bp.route('/mandis', methods=['GET'])
def get_all_mandis():
    mandis = Mandi.query.all()
    return jsonify({'success': True, 'mandis': [m.to_dict() for m in mandis]}), 200
