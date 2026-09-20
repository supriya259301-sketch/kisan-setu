from ..models.transport import TransportProvider
from ..models import db

class LogisticsService:
    @staticmethod
    def get_providers(vehicle_type=None, destination=None, min_capacity=None):
        query = TransportProvider.query

        if vehicle_type and vehicle_type.lower() != 'all':
            query = query.filter(TransportProvider.vehicle_type.ilike(f"%{vehicle_type}%"))
        
        if destination:
            query = query.filter(TransportProvider.destination.ilike(f"%{destination}%"))
            
        if min_capacity:
            query = query.filter(TransportProvider.capacity >= float(min_capacity))

        providers = query.order_by(TransportProvider.rating.desc()).all()
        return [p.to_dict() for p in providers]

    @staticmethod
    def get_provider_by_id(provider_id):
        provider = TransportProvider.query.get(provider_id)
        return provider.to_dict() if provider else None

    @staticmethod
    def contact_provider(provider_id, data):
        provider = TransportProvider.query.get(provider_id)
        if not provider:
            return {'error': 'Transport provider not found'}, 404

        # In production this sends SMS/WhatsApp to transporter
        farmer_name = data.get('farmer_name', 'Farmer')
        farmer_phone = data.get('farmer_phone', '')
        pickup_location = data.get('pickup_location', '')
        drop_location = data.get('drop_location', provider.destination)
        crop = data.get('crop', '')
        quantity = data.get('quantity', '')

        return {
            'success': True,
            'message': f'Booking inquiry forwarded to {provider.name}. Driver will contact {farmer_phone} within 15 minutes.',
            'driver_phone': provider.phone,
            'driver_name': provider.name,
            'vehicle': provider.vehicle_type,
            'rate_per_km': provider.rate_per_km,
            'details': {
                'pickup': pickup_location,
                'drop': drop_location,
                'crop': crop,
                'quantity': quantity
            }
        }, 200
