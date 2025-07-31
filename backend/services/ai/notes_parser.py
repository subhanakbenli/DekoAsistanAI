"""
NotesParser - Parses user notes into structured information.
KISS principle: Single responsibility for parsing notes.
"""
from typing import Dict, Any
import json
import re
from config import logger


class NotesParser:
    """
    Simple parser for user notes containing room information.
    Keeps parsing logic separate and focused.
    """
    
    @staticmethod
    def parse_notes(notes: str) -> Dict[str, Any]:
        """
        Parse notes to extract structured information.
        
        NOTE: Color palette and room dimensions are now provided separately 
        by frontend, but we still parse them for backwards compatibility.
        Main focus is now on: extra areas, product categories, door/windows, user notes.
        
        Args:
            notes: Raw notes string
            
        Returns:
            Dict: Parsed information structure
        """
        parsed_info = {
            'room_dimensions': None,
            'extra_areas': [],
            'color_palette': None,
            'product_categories': [],
            'door_window_positions': None,
            'user_notes': None
        }
        
        if not notes or not isinstance(notes, str):
            return parsed_info
        
        try:
            lines = notes.split('\n')
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                # Parse different sections
                NotesParser._parse_room_dimensions(line, parsed_info)
                NotesParser._parse_color_palette(line, parsed_info)
                NotesParser._parse_product_categories(line, parsed_info)
                NotesParser._parse_extra_areas(line, parsed_info)
                NotesParser._parse_door_windows(line, parsed_info)
                NotesParser._parse_user_notes(line, parsed_info)
            
            return parsed_info
            
        except Exception as e:
            logger.error(f"Error parsing notes: {str(e)}")
            return parsed_info
    
    @staticmethod
    def _parse_room_dimensions(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse room dimensions from line."""
        if line.startswith('Oda Boyutları:'):
            dimensions_text = line.replace('Oda Boyutları:', '').strip()
            dimension_match = re.search(r'(\d+)cm x (\d+)cm x (\d+)cm', dimensions_text)
            if dimension_match:
                parsed_info['room_dimensions'] = {
                    'width': int(dimension_match.group(1)),
                    'length': int(dimension_match.group(2)),
                    'height': int(dimension_match.group(3))
                }
    
    @staticmethod
    def _parse_color_palette(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse color palette information from line."""
        if line.startswith('Renk Paleti:'):
            palette_info = line.replace('Renk Paleti:', '').strip()
            parsed_info['color_palette'] = {
                'type': 'palette',
                'description': palette_info
            }
        elif line.startswith('Renk Kodları:'):
            color_codes = line.replace('Renk Kodları:', '').strip()
            if parsed_info['color_palette']:
                parsed_info['color_palette']['colors'] = [c.strip() for c in color_codes.split(',')]
        elif line.startswith('Özel Renk Açıklaması:'):
            custom_color = line.replace('Özel Renk Açıklaması:', '').strip()
            parsed_info['color_palette'] = {
                'type': 'custom',
                'description': custom_color
            }
    
    @staticmethod
    def _parse_product_categories(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse product categories from line."""
        if line.startswith('Seçilen Ürün Kategorileri:'):
            return  # Header line, skip
        elif line.startswith('  - '):
            # Product category line like "  - Mobilya (🪑)"
            product_line = line.replace('  - ', '').strip()
            if '(' in product_line and ')' in product_line:
                name_part = product_line.split('(')[0].strip()
                icon_part = product_line.split('(')[1].replace(')', '').strip()
                parsed_info['product_categories'].append({
                    'name': name_part,
                    'icon': icon_part
                })
        elif line.startswith('Özel Ürün Açıklaması:'):
            custom_products = line.replace('Özel Ürün Açıklaması:', '').strip()
            parsed_info['product_categories'] = [{
                'type': 'custom',
                'description': custom_products
            }]
    
    @staticmethod
    def _parse_extra_areas(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse extra areas/blocks from line."""
        if line.startswith('Ekstra Alanlar:'):
            return  # Header line, skip
        elif re.match(r'\s*\d+\.\s+\d+cm x \d+cm', line):
            # Lines like "  1. 150cm x 200cm (Konum: x:100cm, y:50cm)"
            area_match = re.search(r'(\d+)cm x (\d+)cm.*x:(\d+)cm.*y:(\d+)cm', line)
            if area_match:
                parsed_info['extra_areas'].append({
                    'width': int(area_match.group(1)),
                    'length': int(area_match.group(2)),
                    'x': int(area_match.group(3)),
                    'y': int(area_match.group(4))
                })
    
    @staticmethod
    def _parse_door_windows(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse door/window positions from line."""
        if line.startswith('Kapı/Pencere Pozisyonları:'):
            positions_text = line.replace('Kapı/Pencere Pozisyonları:', '').strip()
            try:
                parsed_info['door_window_positions'] = json.loads(positions_text)
            except json.JSONDecodeError:
                parsed_info['door_window_positions'] = positions_text
    
    @staticmethod
    def _parse_user_notes(line: str, parsed_info: Dict[str, Any]) -> None:
        """Parse user notes from line."""
        if line.startswith('Kullanıcı Notları:'):
            user_notes = line.replace('Kullanıcı Notları:', '').strip()
            parsed_info['user_notes'] = user_notes
