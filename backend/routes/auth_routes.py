from flask import Blueprint, request, jsonify, session
from ..models.farmer import Farmer
from ..models import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    mobile = data.get('mobile', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '').strip()
    village = data.get('village', '').strip()
    district = data.get('district', '').strip()
    state = data.get('state', '').strip()
    language = data.get('language', 'en')

    # Validation
    if not name or not mobile or not password or not village or not district or not state:
        return jsonify({'error': 'Name, mobile, password, village, district, and state are required'}), 400

    if len(mobile) < 10:
        return jsonify({'error': 'Mobile number must be at least 10 digits'}), 400

    # Check if mobile already exists
    if Farmer.query.filter_by(mobile=mobile).first():
        return jsonify({'error': 'Mobile number already registered. Please login.'}), 409

    if email and Farmer.query.filter_by(email=email).first():
        return jsonify({'error': 'Email address already in use.'}), 409

    farmer = Farmer(
        name=name,
        mobile=mobile,
        email=email or f"farmer_{mobile}@kisansetu.in",
        village=village,
        district=district,
        state=state,
        language=language
    )
    farmer.set_password(password)
    db.session.add(farmer)
    db.session.commit()

    # Session authentication
    session['farmer_id'] = farmer.id
    session['farmer_name'] = farmer.name

    farmer_dict = farmer.to_dict()
    return jsonify({
        'success': True,
        'message': 'Registration successful! Welcome to Kisan Setu.',
        'farmer': farmer_dict,
        'user': farmer_dict
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    mobile_or_email = (data.get('mobile_or_email') or data.get('email') or data.get('mobile') or '').strip()
    password = data.get('password', '').strip()

    if not mobile_or_email or not password:
        return jsonify({'error': 'Invalid email/mobile or password.', 'message': 'Invalid email/mobile or password.'}), 400

    farmer = Farmer.query.filter(
        (Farmer.mobile == mobile_or_email) | (Farmer.email == mobile_or_email)
    ).first()

    if not farmer or not farmer.check_password(password):
        return jsonify({'error': 'Invalid email/mobile or password.', 'message': 'Invalid email/mobile or password.'}), 401

    session['farmer_id'] = farmer.id
    session['farmer_name'] = farmer.name

    farmer_dict = farmer.to_dict()
    return jsonify({
        'success': True,
        'message': f'Welcome, {farmer.name}',
        'farmer': farmer_dict,
        'user': farmer_dict
    }), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('farmer_id', None)
    session.pop('farmer_name', None)
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'}), 200

@auth_bp.route('/me', methods=['GET'])
def get_me():
    farmer_id = session.get('farmer_id')
    if not farmer_id:
        return jsonify({
            'logged_in': False,
            'user': None
        }), 200
    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        session.clear()
        return jsonify({
            'logged_in': False,
            'user': None
        }), 200
    return jsonify({
        'logged_in': True,
        'user': farmer.to_dict(),
        'farmer': farmer.to_dict()
    }), 200

@auth_bp.route('/session', methods=['GET'])
def get_session():
    farmer_id = session.get('farmer_id')
    if not farmer_id:
        return jsonify({'authenticated': False, 'logged_in': False}), 200
    farmer = Farmer.query.get(farmer_id)
    if not farmer:
        session.clear()
        return jsonify({'authenticated': False, 'logged_in': False}), 200
    return jsonify({
        'authenticated': True,
        'logged_in': True,
        'farmer': farmer.to_dict(),
        'user': farmer.to_dict()
    }), 200
