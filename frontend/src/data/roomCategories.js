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
  CALISMA_ODASI: 'çalışma',
  MISAFIR_ODASI: 'misafir'
};

export const PRODUCT_CATEGORIES = {
  // Oturma ve Dinlenme
  KOLTUK: { id: 'koltuk', name: 'Koltuk Takımı', icon: '🛋️' },
  KANEPE: { id: 'kanepe', name: 'Kanepe', icon: '🛋️' },
  BERJER: { id: 'berjer', name: 'Berjer', icon: '🪑' },
  
  // Yataklar
  YATAK: { id: 'yatak', name: 'Yatak', icon: '🛏️' },
  COCUK_YATAGI: { id: 'cocuk_yatagi', name: 'Çocuk Yatağı', icon: '🛏️' },
  RANZA: { id: 'ranza', name: 'Ranza', icon: '🛏️' },
  
  // Depolama
  GARDROP: { id: 'gardrop', name: 'Gardırop', icon: '👕' },
  DOLAP: { id: 'dolap', name: 'Dolap', icon: '🗄️' },
  KOMODIN: { id: 'komodin', name: 'Komodin', icon: '🏠' },
  KITAPLIK: { id: 'kitaplik', name: 'Kitaplık', icon: '📚' },
  OYUNCAK_DOLABI: { id: 'oyuncak_dolabi', name: 'Oyuncak Dolabı', icon: '🧸' },
  DOSYA_DOLABI: { id: 'dosya_dolabi', name: 'Dosya Dolabı', icon: '📁' },
  
  // Masalar
  SEHPA: { id: 'sehpa', name: 'Sehpa', icon: '🪑' },
  TV_UNITESI: { id: 'tv_unitesi', name: 'TV Ünitesi', icon: '📺' },
  YEMEK_MASASI: { id: 'yemek_masasi', name: 'Yemek Masası', icon: '🍽️' },
  CALISMA_MASASI: { id: 'calisma_masasi', name: 'Çalışma Masası', icon: '💻' },
  BUFE: { id: 'bufe', name: 'Büfe', icon: '🍽️' },
  
  // Sandalyeler
  SANDALYE: { id: 'sandalye', name: 'Sandalye', icon: '🪑' },
  BAR_TABURESI: { id: 'bar_taburesi', name: 'Bar Taburesi', icon: '🪑' },
  
  // Mutfak & Banyo
  MUTFAK_DOLABI: { id: 'mutfak_dolabi', name: 'Mutfak Dolabı', icon: '🏠' },
  TEZGAH: { id: 'tezgah', name: 'Tezgah', icon: '🏠' },
  LAVABO: { id: 'lavabo', name: 'Lavabo', icon: '🚿' },
  DUS: { id: 'dus', name: 'Duş Kabini', icon: '🚿' },
  BANYO_DEPOLAMA: { id: 'banyo_depolama', name: 'Banyo Depolama', icon: '🧴' },
  
  // Dekorasyon
  AYDINLATMA: { id: 'aydinlatma', name: 'Aydınlatma', icon: '💡' },
  HALI: { id: 'hali', name: 'Halı', icon: '🪔' },
  PERDE: { id: 'perde', name: 'Perde', icon: '🪟' },
  AYNA: { id: 'ayna', name: 'Ayna', icon: '🪞' },
  DEKORATIF_OBJELER: { id: 'dekoratif_objeler', name: 'Dekoratif Objeler', icon: '🎨' },
  DUVAR_DEKORASYONU: { id: 'duvar_dekorasyonu', name: 'Duvar Dekorasyonu', icon: '🖼️' },
  AKSESUAR: { id: 'aksesuar', name: 'Aksesuar', icon: '✨' },
  
  // Özel Alanlar
  OYUN_ALANI: { id: 'oyun_alani', name: 'Oyun Alanı', icon: '🎮' }
};

export const roomCategories = {
  [ROOM_TYPES.SALON]: {
    name: 'Salon',
    icon: '🛋️',
    description: 'Oturma ve sosyal alan tasarımı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.KOLTUK,
      PRODUCT_CATEGORIES.SEHPA,
      PRODUCT_CATEGORIES.TV_UNITESI,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.PERDE
    ],
    popularCombinations: [
      {
        name: 'Klasik Salon',
        products: ['koltuk', 'sehpa', 'tv_unitesi', 'hali']
      },
      {
        name: 'Modern Salon',
        products: ['kanepe', 'sehpa', 'aydinlatma', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.YATAK_ODASI]: {
    name: 'Yatak Odası',
    icon: '🛏️',
    description: 'Dinlenme ve kişisel alan tasarımı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YATAK,
      PRODUCT_CATEGORIES.GARDROP,
      PRODUCT_CATEGORIES.KOMODIN,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA
    ],
    popularCombinations: [
      {
        name: 'Romantik Yatak Odası',
        products: ['yatak', 'komodin', 'gardrop', 'ayna', 'perde']
      },
      {
        name: 'Minimal Yatak Odası',
        products: ['yatak', 'gardrop', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.COCUK_ODASI]: {
    name: 'Çocuk Odası',
    icon: '🧸',
    description: 'Güvenli ve yaratıcı çocuk alanı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.COCUK_YATAGI,
      PRODUCT_CATEGORIES.OYUN_ALANI,
      PRODUCT_CATEGORIES.DOLAP,
      PRODUCT_CATEGORIES.CALISMA_MASASI,
      PRODUCT_CATEGORIES.OYUNCAK_DOLABI,
      PRODUCT_CATEGORIES.DUVAR_DEKORASYONU,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.AYDINLATMA
    ],
    popularCombinations: [
      {
        name: 'Oyun Odası',
        products: ['cocuk_yatagi', 'oyun_alani', 'oyuncak_dolabi', 'hali']
      },
      {
        name: 'Çalışma Odası',
        products: ['cocuk_yatagi', 'calisma_masasi', 'kitaplik', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.MUTFAK]: {
    name: 'Mutfak',
    icon: '🍳',
    description: 'Fonksiyonel ve modern mutfak tasarımı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.MUTFAK_DOLABI,
      PRODUCT_CATEGORIES.TEZGAH,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER,
      PRODUCT_CATEGORIES.BAR_TABURESI,
      PRODUCT_CATEGORIES.HALI
    ],
    popularCombinations: [
      {
        name: 'Modern Mutfak',
        products: ['mutfak_dolabi', 'tezgah', 'aydinlatma', 'bar_taburesi']
      },
      {
        name: 'Klasik Mutfak',
        products: ['mutfak_dolabi', 'tezgah', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.BANYO]: {
    name: 'Banyo',
    icon: '🚿',
    description: 'Hijyenik ve şık banyo tasarımı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.LAVABO,
      PRODUCT_CATEGORIES.DUS,
      PRODUCT_CATEGORIES.AYNA,
      PRODUCT_CATEGORIES.BANYO_DEPOLAMA,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.AKSESUAR
    ],
    popularCombinations: [
      {
        name: 'Modern Banyo',
        products: ['lavabo', 'dus', 'ayna', 'aydinlatma']
      },
      {
        name: 'Lüks Banyo',
        products: ['lavabo', 'dus', 'ayna', 'banyo_depolama', 'aksesuar']
      }
    ]
  },

  [ROOM_TYPES.YEMEK_ODASI]: {
    name: 'Yemek Odası',
    icon: '🍽️',
    description: 'Sosyal yemek ve ağırlama alanı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YEMEK_MASASI,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.BUFE,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.HALI,
      PRODUCT_CATEGORIES.DEKORATIF_OBJELER
    ],
    popularCombinations: [
      {
        name: 'Klasik Yemek Odası',
        products: ['yemek_masasi', 'sandalye', 'bufe', 'aydinlatma']
      },
      {
        name: 'Modern Yemek Odası',
        products: ['yemek_masasi', 'sandalye', 'dekoratif_objeler']
      }
    ]
  },

  [ROOM_TYPES.CALISMA_ODASI]: {
    name: 'Çalışma Odası',
    icon: '💻',
    description: 'Verimli ve organize çalışma alanı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.CALISMA_MASASI,
      PRODUCT_CATEGORIES.SANDALYE,
      PRODUCT_CATEGORIES.KITAPLIK,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.DOSYA_DOLABI,
      PRODUCT_CATEGORIES.HALI
    ],
    popularCombinations: [
      {
        name: 'Home Office',
        products: ['calisma_masasi', 'sandalye', 'kitaplik', 'aydinlatma']
      },
      {
        name: 'Kütüphane',
        products: ['calisma_masasi', 'kitaplik', 'dosya_dolabi', 'aydinlatma']
      }
    ]
  },

  [ROOM_TYPES.MISAFIR_ODASI]: {
    name: 'Misafir Odası',
    icon: '🏠',
    description: 'Konforlu misafir ağırlama alanı',
    suggestedProducts: [
      PRODUCT_CATEGORIES.YATAK,
      PRODUCT_CATEGORIES.KANEPE,
      PRODUCT_CATEGORIES.DOLAP,
      PRODUCT_CATEGORIES.KOMODIN,
      PRODUCT_CATEGORIES.AYDINLATMA,
      PRODUCT_CATEGORIES.PERDE,
      PRODUCT_CATEGORIES.HALI
    ],
    popularCombinations: [
      {
        name: 'Misafir Yatak Odası',
        products: ['yatak', 'komodin', 'dolap', 'perde']
      },
      {
        name: 'Çok Amaçlı Oda',
        products: ['kanepe', 'sehpa', 'dolap', 'aydinlatma']
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
