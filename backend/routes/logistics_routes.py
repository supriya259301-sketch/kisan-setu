from flask import Blueprint, request, jsonify
from ..services.logistics_service import LogisticsService

logistics_bp = Blueprint('logistics', __name__, url_prefix='/api/logistics')

@logistics_bp.route('', methods=['GET'])
def get_logistics():
    vehicle = request.args.get('vehicle')
    destination = request.args.get('destination')
    min_capacity = request.args.get('min_capacity')
    providers = LogisticsService.get_providers(vehicle_type=vehicle, destination=destination, min_capacity=min_capacity)
    return jsonify({'success': True, 'count': len(providers), 'providers': providers}), 200

@logistics_bp.route('/<int:provider_id>', methods=['GET'])
def get_provider(provider_id):
    provider = LogisticsService.get_provider_by_id(provider_id)
    if not provider:
        return jsonify({'error': 'Transport provider not found'}), 404
    return jsonify({'success': True, 'provider': provider}), 200

@logistics_bp.route('/contact', methods=['POST'])
def contact_provider():
    data = request.get_json() or {}
    provider_id = data.get('provider_id')
    if not provider_id:
        return jsonify({'error': 'Provider ID is required'}), 400
    
    result, status_code = LogisticsService.contact_provider(provider_id, data)
    return jsonify(result), status_code
