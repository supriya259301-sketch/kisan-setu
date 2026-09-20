class ProfitService:
    @staticmethod
    def calculate_net_amount(data):
        """
        Inputs:
        - crop: string
        - quantity: float
        - selling_price: float (per unit / quintal / kg)
        - distance: float (in km)
        - transport_rate: float (per km)
        - mandi_fee_percent: float (percentage)
        """
        try:
            crop = str(data.get('crop', 'Wheat')).strip()
            quantity = float(data.get('quantity', 0))
            selling_price = float(data.get('selling_price', 0))
            distance = float(data.get('distance', 0))
            transport_rate = float(data.get('transport_rate', 0))
            mandi_fee_percent = float(data.get('mandi_fee_percent', 0))

            if quantity <= 0:
                return {'error': 'Quantity must be greater than zero'}, 400
            if selling_price <= 0:
                return {'error': 'Selling price must be greater than zero'}, 400
            if distance < 0 or transport_rate < 0 or mandi_fee_percent < 0:
                return {'error': 'Distance, transport rate, and mandi fee cannot be negative'}, 400

            # Core calculations specified in prompt
            total_crop_value = round(quantity * selling_price, 2)
            transport_cost = round(distance * transport_rate, 2)
            mandi_fee = round((total_crop_value * mandi_fee_percent) / 100.0, 2)
            estimated_net_amount = round(total_crop_value - transport_cost - mandi_fee, 2)

            net_per_unit = round(estimated_net_amount / quantity, 2) if quantity > 0 else 0
            
            # Additional farmer value: Compare with Shared Logistics (typically 45% savings on transport)
            shared_transport_cost = round(transport_cost * 0.55, 2)
            shared_net_amount = round(total_crop_value - shared_transport_cost - mandi_fee, 2)
            potential_savings = round(transport_cost - shared_transport_cost, 2)

            return {
                'success': True,
                'crop': crop,
                'quantity': quantity,
                'selling_price': selling_price,
                'distance': distance,
                'transport_rate': transport_rate,
                'mandi_fee_percent': mandi_fee_percent,
                'total_crop_value': total_crop_value,
                'transport_cost': transport_cost,
                'mandi_fee': mandi_fee,
                'estimated_net_amount': estimated_net_amount,
                'net_per_unit': net_per_unit,
                'shared_transport_cost': shared_transport_cost,
                'shared_net_amount': shared_net_amount,
                'potential_savings': potential_savings,
                'expense_breakdown': {
                    'net_income_ratio': round((estimated_net_amount / total_crop_value * 100), 1) if total_crop_value > 0 else 0,
                    'transport_ratio': round((transport_cost / total_crop_value * 100), 1) if total_crop_value > 0 else 0,
                    'mandi_fee_ratio': round((mandi_fee / total_crop_value * 100), 1) if total_crop_value > 0 else 0
                }
            }, 200

        except (ValueError, TypeError) as e:
            return {'error': f'Invalid numeric input: {str(e)}'}, 400
