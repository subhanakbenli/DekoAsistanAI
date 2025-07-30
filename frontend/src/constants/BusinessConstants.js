/**
 * Business Constants - Domain-specific business logic constants
 * Room types, design styles, categories, and business rules
 */
export class BusinessConstants {
  // Room Types
  static ROOM_TYPES = {
    LIVING_ROOM: {
      key: 'living_room',
      label: 'Oturma Odası',
      icon: '🛋️',
      minArea: 12, // m²
      maxArea: 50
    },
    BEDROOM: {
      key: 'bedroom',
      label: 'Yatak Odası',
      icon: '🛏️',
      minArea: 8,
      maxArea: 30
    },
    KITCHEN: {
      key: 'kitchen',
      label: 'Mutfak',
      icon: '🍳',
      minArea: 6,
      maxArea: 25
    },
    BATHROOM: {
      key: 'bathroom',
      label: 'Banyo',
      icon: '🚿',
      minArea: 3,
      maxArea: 15
    },
    OFFICE: {
      key: 'office',
      label: 'Çalışma Odası',
      icon: '💼',
      minArea: 6,
      maxArea: 20
    },
    DINING_ROOM: {
      key: 'dining_room',
      label: 'Yemek Odası',
      icon: '🍽️',
      minArea: 10,
      maxArea: 30
    }
  };

  // Design Styles
  static DESIGN_STYLES = {
    MODERN: {
      key: 'modern',
      label: 'Modern',
      icon: '🏢',
      description: 'Temiz çizgiler ve minimal tasarım'
    },
    CLASSIC: {
      key: 'classic',
      label: 'Klasik',
      icon: '🏛️',
      description: 'Zarif ve zamansız tasarım'
    },
    MINIMALIST: {
      key: 'minimalist',
      label: 'Minimalist',
      icon: '⚪',
      description: 'Sade ve fonksiyonel yaklaşım'
    },
    INDUSTRIAL: {
      key: 'industrial',
      label: 'Endüstriyel',
      icon: '⚙️',
      description: 'Ham malzemeler ve metal detaylar'
    },
    SCANDINAVIAN: {
      key: 'scandinavian',
      label: 'İskandinav',
      icon: '🌲',
      description: 'Doğal malzemeler ve açık renkler'
    },
    BOHEMIAN: {
      key: 'bohemian',
      label: 'Bohem',
      icon: '🎨',
      description: 'Rengarenk ve sanatsal yaklaşım'
    }
  };

  // Product Categories
  static PRODUCT_CATEGORIES = {
    FURNITURE: {
      key: 'Mobilyalar',
      label: 'Mobilyalar',
      icon: '🪑',
      priority: 1
    },
    LIGHTING: {
      key: 'Aydınlatma',
      label: 'Aydınlatma',
      icon: '💡',
      priority: 2
    },
    DECORATIVE: {
      key: 'Dekoratif Ürünler',
      label: 'Dekoratif Ürünler',
      icon: '🎨',
      priority: 3
    },
    ACCESSORIES: {
      key: 'Aksesuarlar',
      label: 'Aksesuarlar',
      icon: '✨',
      priority: 4
    },
    TEXTILE: {
      key: 'Tekstil',
      label: 'Tekstil',
      icon: '🧵',
      priority: 5
    },
    DECORATIVE_OBJECTS: {
      key: 'Dekoratif Objeler',
      label: 'Dekoratif Objeler',
      icon: '🏺',
      priority: 6
    },
    PLANTS: {
      key: 'Bitkiler',
      label: 'Bitkiler',
      icon: '🪴',
      priority: 7
    },
    CURTAINS: {
      key: 'Perdeler',
      label: 'Perdeler',
      icon: '🪟',
      priority: 8
    }
  };

  // Room Dimension Limits (in cm)
  static DIMENSION_LIMITS = {
    MIN_WIDTH: 150,
    MAX_WIDTH: 2000,
    MIN_LENGTH: 150,
    MAX_LENGTH: 2000,
    MIN_HEIGHT: 200,
    MAX_HEIGHT: 400,
    
    // Warning thresholds
    SMALL_AREA_THRESHOLD: 5, // m²
    LARGE_AREA_THRESHOLD: 100, // m²
    LOW_CEILING_THRESHOLD: 220, // cm
    HIGH_CEILING_THRESHOLD: 350 // cm
  };

  // Design Generation Settings
  static DESIGN_SETTINGS = {
    MAX_PRODUCTS_PER_CATEGORY: 10,
    MIN_PRODUCTS_PER_DESIGN: 5,
    MAX_PRODUCTS_PER_DESIGN: 25,
    DEFAULT_GENERATION_TIMEOUT: 30000, // 30 seconds
    MAX_RETRY_ATTEMPTS: 3
  };

  // User Limits
  static USER_LIMITS = {
    MAX_DESIGNS_PER_DAY: 10,
    MAX_FAVORITES: 100,
    MAX_PROFILE_BIO_LENGTH: 500,
    MAX_ROOM_NAME_LENGTH: 50
  };

  // File Upload Limits
  static UPLOAD_LIMITS = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    MAX_FILES_PER_UPLOAD: 5
  };

  // Helper methods
  static getRoomTypeByKey(key) {
    return Object.values(BusinessConstants.ROOM_TYPES).find(type => type.key === key);
  }

  static getDesignStyleByKey(key) {
    return Object.values(BusinessConstants.DESIGN_STYLES).find(style => style.key === key);
  }

  static getProductCategoryByKey(key) {
    return Object.values(BusinessConstants.PRODUCT_CATEGORIES).find(cat => cat.key === key);
  }

  static getRoomTypesAsArray() {
    return Object.values(BusinessConstants.ROOM_TYPES);
  }

  static getDesignStylesAsArray() {
    return Object.values(BusinessConstants.DESIGN_STYLES);
  }

  static getProductCategoriesAsArray() {
    return Object.values(BusinessConstants.PRODUCT_CATEGORIES)
      .sort((a, b) => a.priority - b.priority);
  }
}

export default BusinessConstants;
