from flask import Blueprint, request, jsonify
from ..services.profit_service import ProfitService

profit_bp = Blueprint('profit', __name__, url_prefix='/api/profit')

@profit_bp.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json() or {}
    result, status_code = ProfitService.calculate_net_amount(data)
    return jsonify(result), status_code
