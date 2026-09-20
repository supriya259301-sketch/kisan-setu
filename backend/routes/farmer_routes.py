from flask import Blueprint, request, jsonify, session
from ..models.farmer import Farmer
from ..models import db

farmer_bp = Blueprint('farmer', __name__, url_prefix='/api/farmer')

@farmer_bp.route('/profile', methods=['GET'])
def get_profile():
    farmer_id = session.get('farmer_id')
    if not farmer_id:
        return jsonify({'error': 'Unauthorized. Please login to view profile.', 'authenticated': False}), 401

    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        session.clear()
        return jsonify({'error': 'Farmer profile not found.', 'authenticated': False}), 404

    return jsonify({
        'success': True,
        'profile': farmer.to_dict()
    }), 200

@farmer_bp.route('/profile', methods=['PUT'])
def update_profile():
    farmer_id = session.get('farmer_id')
    if not farmer_id:
        return jsonify({'error': 'Unauthorized. Please login to update profile.', 'authenticated': False}), 401

    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        session.clear()
        return jsonify({'error': 'Farmer profile not found.', 'authenticated': False}), 404

    data = request.get_json() or {}
    if 'name' in data and data['name'].strip():
        farmer.name = data['name'].strip()
    if 'email' in data:
        farmer.email = data['email'].strip()
    if 'village' in data and data['village'].strip():
        farmer.village = data['village'].strip()
    if 'district' in data and data['district'].strip():
        farmer.district = data['district'].strip()
    if 'state' in data and data['state'].strip():
        farmer.state = data['state'].strip()
    if 'language' in data and data['language'].strip():
        farmer.language = data['language'].strip()
    if 'farm_size_acres' in data:
        try:
            farmer.farm_size_acres = float(data['farm_size_acres'])
        except (ValueError, TypeError):
            pass

    db.session.commit()

    return jsonify({
        'success': True,
        'message': 'Profile updated successfully',
        'profile': farmer.to_dict()
    }), 200
