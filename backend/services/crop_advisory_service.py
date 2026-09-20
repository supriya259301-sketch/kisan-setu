from ..models.crop import Crop

class CropAdvisoryService:
    @staticmethod
    def get_advisory(location=None, season=None, crop_name=None):
        query = Crop.query
        if season and season.lower() != 'all':
            query = query.filter(Crop.season.ilike(f"%{season}%"))
        
        if crop_name and crop_name.lower() != 'all':
            query = query.filter(Crop.name.ilike(f"%{crop_name}%"))

        crops = query.all()
        advisory_list = []

        # Region-specific agronomic parameters based on location
        region_notes = {
            'punjab': 'Ensure laser land leveling and direct seeded rice (DSR) to save groundwater.',
            'haryana': 'Opt for micro-irrigation under 'Har Khet Ko Pani' state subsidy.',
            'uttar pradesh': 'Balanced NPK ratio of 4:2:1 with Zinc Sulphate boost for alluvial soils.',
            'madhya pradesh': 'Deep summer ploughing to eradicate wilt pathogen in soybean and gram.',
            'maharashtra': 'Mulching and drip irrigation recommended to conserve soil moisture.',
            'gujarat': 'Soil solarization and micro-nutrient foliar spray after 45 days of sowing.',
            'rajasthan': 'Water-harvesting sprinkler irrigation; drought tolerant varieties suggested.'
        }

        loc_key = (location or '').lower()
        regional_tip = "Test soil health card every 2 years and use certified seeds for maximum yield."
        for reg, tip in region_notes.items():
            if reg in loc_key:
                regional_tip = tip
                break

        for crop in crops:
            advisory_list.append({
                'id': crop.id,
                'crop': crop.name,
                'hindi_name': crop.hindi_name,
                'season': crop.season,
                'sowing_period': crop.sowing_period,
                'harvesting_period': crop.harvesting_period,
                'market_demand': crop.demand,
                'standard_msp': crop.standard_msp,
                'crop_info': crop.advisory,
                'regional_tip': regional_tip,
                'irrigation': '3-4 cycles during critical stages (Crown root initiation, flowering, grain filling)',
                'pest_management': 'Monitor early for stem borer and yellow rust; apply neem oil 5ml/L preventively.'
            })

        return advisory_list
