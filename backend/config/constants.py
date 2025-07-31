"""
Application constants and error messages.
Centralized constants following KISS principle.
"""

# HTTP Error Messages
DESIGN_NOT_FOUND = "Design not found"
INTERNAL_SERVER_ERROR = "Internal server error"
AUTHENTICATION_REQUIRED = "Authentication required"
ACCESS_DENIED = "Access denied"

# Success Messages
DESIGN_CREATED_SUCCESS = "Design suggestion created successfully"
FAVORITES_UPDATED = "Favorites updated successfully"
LOGOUT_SUCCESS = "Successfully logged out"

# Default Values
DEFAULT_DESIGN_LIMIT = 20
DEFAULT_OFFSET = 0

# File Extensions
ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp']

# Product Categories
PRODUCT_CATEGORIES = {
    'mobilya': 'Mobilya',
    'aydinlatma': 'Aydınlatma',
    'tekstil': 'Tekstil Ürünler',
    'dekoratif': 'Dekoratif Ürünler',
    'aksesuar': 'Aksesuar',
    'depolama': 'Depolama Çözümleri'
}
