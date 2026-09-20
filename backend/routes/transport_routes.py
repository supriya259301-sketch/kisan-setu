from flask import Blueprint, request, jsonify, session
from ..services.transport_service import TransportService
from ..models.farmer import Farmer
from ..models import db

transport_bp = Blueprint('transport', __name__, url_prefix='/api')

@transport_bp.route('/shared-transport', methods=['GET'])
def get_shared_trips():
    destination = request.args.get('destination')
    date = request.args.get('date')
    trips = TransportService.get_shared_trips(destination=destination, date=date)
    return jsonify({'success': True, 'count': len(trips), 'trips': trips}), 200

@transport_bp.route('/shared-transport', methods=['POST'])
def create_shared_trip():
    farmer_id = session.get('farmer_id')
    data = request.get_json() or {}
    
    # If not in session, allow passing farmer_id in body for testing/demonstration
    if not farmer_id:
        farmer_id = data.get('farmer_id', 1)

    result = TransportService.create_shared_trip(farmer_id, data)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify({'success': True, 'message': 'Shared trip created successfully', 'trip': result}), 201

@transport_bp.route('/shared-transport/<int:trip_id>/join', methods=['POST'])
def join_shared_trip(trip_id):
    data = request.get_json() or {}
    farmer_id = session.get('farmer_id') or data.get('farmer_id', 1)
    
    result = TransportService.join_shared_trip(trip_id, farmer_id, data)
    if isinstance(result, tuple):
        return jsonify(result[0]), result[1]
    return jsonify(result), 200

@transport_bp.route('/farmer/profile', methods=['GET'])
def get_profile():
    farmer_id = session.get('farmer_id', 1) # Default demo farmer if not logged in
    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        return jsonify({'error': 'Farmer profile not found'}), 404
    return jsonify({'success': True, 'profile': farmer.to_dict()}), 200

@transport_bp.route('/farmer/profile', methods=['PUT'])
def update_profile():
    farmer_id = session.get('farmer_id', 1)
    data = request.get_json() or {}
    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        return jsonify({'error': 'Farmer not found'}), 404

    if 'name' in data:
        farmer.name = data['name'].strip()
    if 'mobile' in data:
        farmer.mobile = data['mobile'].strip()
    if 'email' in data:
        farmer.email = data['email'].strip()
    if 'village' in data:
        farmer.village = data['village'].strip()
    if 'district' in data:
        farmer.district = data['district'].strip()
    if 'state' in data:
        farmer.state = data['state'].strip()
    if 'language' in data:
        farmer.language = data['language'].strip()
    if 'farm_size_acres' in data:
        farmer.farm_size_acres = float(data['farm_size_acres'])

    db.session.commit()
    return jsonify({'success': True, 'message': 'Profile updated successfully', 'profile': farmer.to_dict()}), 200
