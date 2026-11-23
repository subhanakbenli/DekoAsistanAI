/**
 * Room Categories and Product Suggestions Data
 * Comprehensive room types with specific product recommendations
 * Each room type includes relevant furniture and decoration categories
 */

export const ROOM_TYPES = {
  SALON: 'salon',
  YATAK_ODASI: 'yatak',
  COCUK_ODASI: 'çocuk',
  MUTFAK: 'mutfak',
  BANYO: 'banyo',
  YEMEK_ODASI: 'yemek',
  CALISMA_ODASI: 'calisma',
  MISAFIR_ODASI: 'misafir'
};

export const PRODUCT_CATEGORIES = {
  // Seating and lounging
  KOLTUK: { id: 'koltuk', name: 'Koltuk Takımı', label: 'Sofa Set', icon: '🛋️' },
  BERJER: { id: 'berjer', name: 'Berjer', label: 'Armchair', icon: '🪑' },
  
  // Beds
  YATAK: { id: 'yatak', name: 'Yatak', label: 'Bed', icon: '🛏️' },
  COCUK_YATAGI: { id: 'cocuk_yatagi', name: 'Çocuk Yatağı', label: 'Kids\' Bed', icon: '🛏️' },
  RANZA: { id: 'ranza', name: 'Ranza', label: 'Bunk Bed', icon: '🛏️' },
  
  // Storage
  GARDROP: { id: 'gardrop', name: 'Gardırop', label: 'Wardrobe', icon: '👕' },
  DOLAP: { id: 'dolap', name: 'Dolap', label: 'Cabinet', icon: '🗄️' },
  KOMODIN: { id: 'komodin', name: 'Komodin', label: 'Nightstand', icon: '🏠' },
  KITAPLIK: { id: 'kitaplik', name: 'Kitaplık', label: 'Bookcase', icon: '📚' },
  OYUNCAK_DOLABI: { id: 'oyuncak_dolabi', name: 'Oyuncak Dolabı', label: 'Toy Cabinet', icon: '🧸' },
  DOSYA_DOLABI: { id: 'dosya_dolabi', name: 'Dosya Dolabı', label: 'File Cabinet', icon: '📁' },
  
  // Tables
  SEHPA: { id: 'sehpa', name: 'Sehpa', label: 'Coffee Table', icon: '🪑' },
  TV_UNITESI: { id: 'tv_unitesi', name: 'TV Ünitesi', label: 'TV Unit', icon: '📺' },
  YEMEK_MASASI: { id: 'yemek_masasi', name: 'Yemek Masası', label: 'Dining Table', icon: '🍽️' },
  CALISMA_MASASI: { id: 'calisma_masasi', name: 'Çalışma Masası', label: 'Desk', icon: '💻' },
  BUFE: { id: 'bufe', name: 'Büfe', label: 'Sideboard', icon: '🍽️' },
  
  // Chairs
  SANDALYE: { id: 'sandalye', name: 'Sandalye', label: 'Chair', icon: '🪑' },
  BAR_TABURESI: { id: 'bar_taburesi', name: 'Bar Taburesi', label: 'Bar Stool', icon: '🪑' },
  
  // Kitchen & bathroom
  MUTFAK_DOLABI: { id: 'mutfak_dolabi', name: 'Mutfak Dolabı', label: 'Kitchen Cabinet', icon: '🏠' },
  TEZGAH: { id: 'tezgah', name: 'Tezgah', label: 'Countertop', icon: '🏠' },
  LAVABO: { id: 'lavabo', name: 'Lavabo', label: 'Sink', icon: '🚿' },
  DUS: { id: 'dus', name: 'Duş Kabini', label: 'Shower Cabin', icon: '🚿' },
  BANYO_DEPOLAMA: { id: 'banyo_depolama', name: 'Banyo Depolama', label: 'Bathroom Storage', icon: '🧴' },
  
  // Decoration
  AYDINLATMA: { id: 'aydinlatma', name: 'Aydınlatma', label: 'Lighting', icon: '💡' },
  HALI: { id: 'hali', name: 'Halı', label: 'Rug', icon: '🪔' },
  PERDE: { id: 'perde', name: 'Perde', label: 'Curtains', icon: '🪟' },
  AYNA: { id: 'ayna', name: 'Ayna', label: 'Mirror', icon: '🪞' },
  DEKORATIF_OBJELER: { id: 'dekoratif_objeler', name: 'Dekoratif Objeler', label: 'Decorative Objects', icon: '🎨' },
  DUVAR_DEKORASYONU: { id: 'duvar_dekorasyonu', name: 'Duvar Dekorasyonu', label: 'Wall Decor', icon: '🖼️' },
  AKSESUAR: { id: 'aksesuar', name: 'Aksesuar', label: 'Accessories', icon: '✨' },
  
  // Special areas
  OYUN_ALANI: { id: 'oyun_alani', name: 'Oyun Alanı', label: 'Play Area', icon: '🎮' }
};

export const roomCategories = {
  [ROOM_TYPES.SALON]: {
    name: 'Living Room',
    icon: '🛋️',
    description: 'Design for seating and social space',
    suggestedProducts: [
      PRODUCT_CATEGORIES.KOLTUK,
      PRODUCT_CATEGORIES.SEHPA,
      PRODUCT_CATEGORIES.TV_UNITESI,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Classic Living Room',
        products: ['koltuk', 'sehpa', 'tv_unitesi', 'hali']
      },
      {
        name: 'Modern Living Room',
        products: ['koltuk', 'sehpa', 'aydinlatma', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.YATAK_ODASI]: {
    name: 'Bedroom',
    icon: '🛏️',
    description: 'Design for rest and personal space',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YATAK,
      PRODUCT_CATEGORIES.GARDROP,
      PRODUCT_CATEGORIES.KOMODIN,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Romantic Bedroom',
        products: ['yatak', 'komodin', 'gardrop', 'ayna', 'perde']
      },
      {
        name: 'Minimal Bedroom',
        products: ['yatak', 'gardrop', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.COCUK_ODASI]: {
    name: 'Kids\' Room',
    icon: '🧸',
    description: 'A safe and creative space for kids',
    suggestedProducts: [
      PRODUCT_CATEGORIES.COCUK_YATAGI,
      PRODUCT_CATEGORIES.OYUN_ALANI,
      PRODUCT_CATEGORIES.DOLAP,
      PRODUCT_CATEGORIES.CALISMA_MASASI,
      PRODUCT_CATEGORIES.OYUNCAK_DOLABI,
      PRODUCT_CATEGORIES.DUVAR_DEKORASYONU,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Playroom',
        products: ['cocuk_yatagi', 'oyun_alani', 'oyuncak_dolabi', 'hali']
      },
      {
        name: 'Study Corner',
        products: ['cocuk_yatagi', 'calisma_masasi', 'kitaplik', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.MUTFAK]: {
    name: 'Kitchen',
    icon: '🍳',
    description: 'Functional, modern kitchen design',
    suggestedProducts: [
      PRODUCT_CATEGORIES.MUTFAK_DOLABI,
      PRODUCT_CATEGORIES.TEZGAH,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.BAR_TABURESI,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.DOLAP,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Modern Kitchen',
        products: ['mutfak_dolabi', 'tezgah', 'aydinlatma', 'bar_taburesi']
      },
      {
        name: 'Classic Kitchen',
        products: ['mutfak_dolabi', 'tezgah', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.BANYO]: {
    name: 'Bathroom',
    icon: '🚿',
    description: 'Hygienic, stylish bathroom design',
    suggestedProducts: [
      PRODUCT_CATEGORIES.LAVABO,
      PRODUCT_CATEGORIES.DUS,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.BANYO_DEPOLAMA,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.AKSESUAR,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.DOLAP
    ],
    popularCombinations: [
      {
        name: 'Modern Bathroom',
        products: ['lavabo', 'dus', 'ayna', 'aydinlatma']
      },
      {
        name: 'Luxury Bathroom',
        products: ['lavabo', 'dus', 'ayna', 'banyo_depolama', 'aksesuar']
      }
    ]
  },

  [ROOM_TYPES.YEMEK_ODASI]: {
    name: 'Dining Room',
    icon: '🍽️',
    description: 'A space for dining and entertaining',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YEMEK_MASASI,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.BUFE,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Classic Dining Room',
        products: ['yemek_masasi', 'sandalye', 'bufe', 'aydinlatma']
      },
      {
        name: 'Modern Dining Room',
        products: ['yemek_masasi', 'sandalye', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.CALISMA_ODASI]: {
    name: 'Study',
    icon: '💻',
    description: 'An efficient, organized workspace',
    suggestedProducts: [
      PRODUCT_CATEGORIES.CALISMA_MASASI,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DOSYA_DOLABI,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Home Office',
        products: ['calisma_masasi', 'sandalye', 'kitaplik', 'aydinlatma']
      },
      {
        name: 'Library',
        products: ['calisma_masasi', 'kitaplik', 'dosya_dolabi', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.MISAFIR_ODASI]: {
    name: 'Guest Room',
    icon: '🏠',
    description: 'A comfortable space for hosting guests',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YATAK,
      PRODUCT_CATEGORIES.DOLAP,
      PRODUCT_CATEGORIES.KOMODIN,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.SEHPA,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Guest Bedroom',
        products: ['yatak', 'komodin', 'dolap', 'perde']
      },
      {
        name: 'Multipurpose Room',
        products: ['koltuk', 'sehpa', 'dolap', 'aydinlatma']
      }
    ]
  }
};

/**
 * Get suggested products for a room type
 */
export const getSuggestedProducts = (roomType) => {
  const room = roomCategories[roomType];
  return room ? room.suggestedProducts : [];
};

/**
 * Get popular combinations for a room type
 */
export const getPopularCombinations = (roomType) => {
  const room = roomCategories[roomType];
  return room ? room.popularCombinations : [];
};

/**
 * Get room info by type
 */
export const getRoomInfo = (roomType) => {
  return roomCategories[roomType] || null;
};

/**
 * Get all available room types
 */
export const getAllRoomTypes = () => {
  return Object.entries(roomCategories).map(([key, value]) => ({
    id: key,
    ...value
  }));
};
