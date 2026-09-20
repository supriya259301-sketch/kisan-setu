import os
from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .models import db

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Enable CORS for frontend integration
    CORS(app, supports_credentials=True)

    # Ensure database directory exists
    db_dir = os.path.join(os.path.abspath(os.path.dirname(__file__)), 'database')
    os.makedirs(db_dir, exist_ok=True)

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    from .routes.auth_routes import auth_bp
    from .routes.buyer_routes import buyer_bp
    from .routes.profit_routes import profit_bp
    from .routes.logistics_routes import logistics_bp
    from .routes.transport_routes import transport_bp
    from .routes.crop_routes import crop_bp
    from .routes.language_routes import language_bp
    from .routes.farmer_routes import farmer_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(buyer_bp)
    app.register_blueprint(profit_bp)
    app.register_blueprint(logistics_bp)
    app.register_blueprint(transport_bp)
    app.register_blueprint(crop_bp)
    app.register_blueprint(language_bp)
    app.register_blueprint(farmer_bp)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'platform': 'KISAN SETU API',
            'version': '1.0.0'
        }), 200

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
