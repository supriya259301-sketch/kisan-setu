from flask import Blueprint, jsonify

language_bp = Blueprint('languages', __name__, url_prefix='/api')

SUPPORTED_LANGUAGES = [
    {'code': 'en', 'name': 'English', 'native': 'English', 'badge': 'EN'},
    {'code': 'hi', 'name': 'Hindi', 'native': 'हिन्दी', 'badge': 'HI'},
    {'code': 'pa', 'name': 'Punjabi', 'native': 'ਪੰਜਾਬੀ', 'badge': 'PA'},
    {'code': 'mr', 'name': 'Marathi', 'native': 'मराठी', 'badge': 'MR'},
    {'code': 'bn', 'name': 'Bengali', 'native': 'বাংলা', 'badge': 'BN'},
    {'code': 'gu', 'name': 'Gujarati', 'native': 'ગુજરાતી', 'badge': 'GU'},
    {'code': 'ta', 'name': 'Tamil', 'native': 'தமிழ்', 'badge': 'TA'},
    {'code': 'te', 'name': 'Telugu', 'native': 'తెలుగు', 'badge': 'TE'},
    {'code': 'kn', 'name': 'Kannada', 'native': 'ಕನ್ನಡ', 'badge': 'KN'}
]

@language_bp.route('/languages', methods=['GET'])
def get_languages():
    return jsonify({
        'success': True,
        'count': len(SUPPORTED_LANGUAGES),
        'languages': SUPPORTED_LANGUAGES
    }), 200
