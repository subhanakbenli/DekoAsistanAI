/**
 * Color Palettes Data
 * Comprehensive collection of design color palettes for interior design
 * Each palette includes category, colors, and metadata
 */

export const COLOR_PALETTE_CATEGORIES = {
  WARM: 'warm',
  COOL: 'cool',
  NATURAL: 'natural',
  MODERN: 'modern',
  CLASSIC: 'classic',
  MINIMALIST: 'minimalist',
  VINTAGE: 'vintage',
  TROPICAL: 'tropical',
  SCANDINAVIAN: 'scandinavian',
  INDUSTRIAL: 'industrial',
  BOHEMIAN: 'bohemian',
  ART_DECO: 'art_deco',
  MONOCHROME: 'monochrome',
  PASTEL: 'pastel',
  EARTH: 'earth',
  LUXURY: 'luxury'
};

export const colorPalettes = [
  // Warm tones
  {
    id: 'warm-sunset',
    category: COLOR_PALETTE_CATEGORIES.WARM,
    name: 'Sunset Warmth',
    description: 'Orange, red and gold tones',
    colors: ['#FF6B35', '#F7931E', '#FFD23F', '#EE4B2B', '#C4622D'],
    gradient: 'bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500',
    isPopular: true
  },
  {
    id: 'warm-autumn',
    category: COLOR_PALETTE_CATEGORIES.WARM,
    name: 'Autumn Leaves',
    description: 'Brown, orange and russet tones',
    colors: ['#8B4513', '#CD853F', '#D2691E', '#B22222', '#A0522D'],
    gradient: 'bg-gradient-to-r from-amber-600 via-orange-600 to-red-600'
  },
  {
    id: 'warm-terracotta',
    category: COLOR_PALETTE_CATEGORIES.WARM,
    name: 'Terracotta Warmth',
    description: 'Earthy and warm brown tones',
    colors: ['#E2725B', '#C65D07', '#8B4513', '#CD853F', '#DEB887'],
    gradient: 'bg-gradient-to-r from-orange-400 via-amber-600 to-yellow-600'
  },

  // Cool tones
  {
    id: 'cool-ocean',
    category: COLOR_PALETTE_CATEGORIES.COOL,
    name: 'Ocean Depths',
    description: 'Blue and green tones',
    colors: ['#006994', '#13678A', '#45B69C', '#21D4B4', '#B8E6B8'],
    gradient: 'bg-gradient-to-r from-blue-600 via-teal-500 to-green-400',
    isPopular: true
  },
  {
    id: 'cool-arctic',
    category: COLOR_PALETTE_CATEGORIES.COOL,
    name: 'Arctic Glacier',
    description: 'White, gray and ice blue',
    colors: ['#F0F8FF', '#E6F3FF', '#B0E0E6', '#87CEEB', '#4682B4'],
    gradient: 'bg-gradient-to-r from-blue-100 via-blue-200 to-blue-400'
  },
  {
    id: 'cool-lavender',
    category: COLOR_PALETTE_CATEGORIES.COOL,
    name: 'Lavender Garden',
    description: 'Purple and lilac tones',
    colors: ['#E6E6FA', '#DDA0DD', '#9370DB', '#8B008B', '#4B0082'],
    gradient: 'bg-gradient-to-r from-purple-200 via-purple-400 to-purple-700'
  },

  // Natural tones
  {
    id: 'natural-forest',
    category: COLOR_PALETTE_CATEGORIES.NATURAL,
    name: 'Forest Green',
    description: 'Natural green and brown tones',
    colors: ['#228B22', '#32CD32', '#90EE90', '#8FBC8F', '#6B8E23'],
    gradient: 'bg-gradient-to-r from-green-600 via-green-400 to-lime-400',
    isPopular: true
  },
  {
    id: 'natural-stone',
    category: COLOR_PALETTE_CATEGORIES.NATURAL,
    name: 'Stone Texture',
    description: 'Gray and beige natural stone colors',
    colors: ['#696969', '#A9A9A9', '#D3D3D3', '#F5F5DC', '#DDBEA9'],
    gradient: 'bg-gradient-to-r from-gray-600 via-gray-400 to-stone-300'
  },

  // Modern tones
  {
    id: 'modern-minimal',
    category: COLOR_PALETTE_CATEGORIES.MODERN,
    name: 'Modern Minimal',
    description: 'Black, white and gray tones',
    colors: ['#000000', '#333333', '#666666', '#CCCCCC', '#FFFFFF'],
    gradient: 'bg-gradient-to-r from-black via-gray-500 to-white',
    isPopular: true
  },
  {
    id: 'modern-neon',
    category: COLOR_PALETTE_CATEGORIES.MODERN,
    name: 'Neon Accent',
    description: 'Vivid neon colors',
    colors: ['#FF1493', '#00FFFF', '#ADFF2F', '#FF4500', '#9400D3'],
    gradient: 'bg-gradient-to-r from-pink-500 via-cyan-400 to-lime-400'
  },

  // Classic tones
  {
    id: 'classic-royal',
    category: COLOR_PALETTE_CATEGORIES.CLASSIC,
    name: 'Royal Palace',
    description: 'Deep blue, gold and red',
    colors: ['#4169E1', '#FFD700', '#DC143C', '#800080', '#2F4F4F'],
    gradient: 'bg-gradient-to-r from-blue-600 via-yellow-400 to-red-600',
    isPopular: true
  },
  {
    id: 'classic-vintage',
    category: COLOR_PALETTE_CATEGORIES.CLASSIC,
    name: 'Vintage Elegance',
    description: 'Pale pink, cream and gold',
    colors: ['#F8BBD9', '#F4E4BC', '#E6D690', '#C9A96E', '#A67B5B'],
    gradient: 'bg-gradient-to-r from-pink-200 via-yellow-200 to-yellow-600'
  },

  // Minimalist tones
  {
    id: 'minimalist-pure',
    category: COLOR_PALETTE_CATEGORIES.MINIMALIST,
    name: 'Pure Minimalism',
    description: 'White and very light gray tones',
    colors: ['#FFFFFF', '#FAFAFA', '#F5F5F5', '#EEEEEE', '#E0E0E0'],
    gradient: 'bg-gradient-to-r from-white via-gray-50 to-gray-200'
  },
  {
    id: 'minimalist-warm',
    category: COLOR_PALETTE_CATEGORIES.MINIMALIST,
    name: 'Warm Minimalism',
    description: 'Minimalist cream and beige tones',
    colors: ['#FFF8DC', '#F5F5DC', '#FAEBD7', '#F0E68C', '#DDD6C0'],
    gradient: 'bg-gradient-to-r from-cream via-beige to-tan-200'
  },

  // Scandinavian
  {
    id: 'scandinavian-light',
    category: COLOR_PALETTE_CATEGORIES.SCANDINAVIAN,
    name: 'Scandinavian Light',
    description: 'Light colors and natural wood',
    colors: ['#F7F7F7', '#E8E8E8', '#D4B996', '#A67B5B', '#8B7355'],
    gradient: 'bg-gradient-to-r from-gray-50 via-stone-200 to-amber-700',
    isPopular: true
  },

  // Tropical
  {
    id: 'tropical-paradise',
    category: COLOR_PALETTE_CATEGORIES.TROPICAL,
    name: 'Tropical Paradise',
    description: 'Vivid green, blue and pink',
    colors: ['#00FF7F', '#20B2AA', '#FF69B4', '#FFA500', '#FFFF00'],
    gradient: 'bg-gradient-to-r from-emerald-400 via-teal-400 to-pink-400'
  },

  // Industrial
  {
    id: 'industrial-raw',
    category: COLOR_PALETTE_CATEGORIES.INDUSTRIAL,
    name: 'Raw Industrial',
    description: 'Metal gray and rust colors',
    colors: ['#36454F', '#708090', '#A9A9A9', '#CD853F', '#8B4513'],
    gradient: 'bg-gradient-to-r from-slate-600 via-gray-500 to-amber-600'
  },

  // Bohemian
  {
    id: 'bohemian-rich',
    category: COLOR_PALETTE_CATEGORIES.BOHEMIAN,
    name: 'Rich Bohemian',
    description: 'Deep colors with gold accents',
    colors: ['#8B008B', '#FF4500', '#DAA520', '#2E8B57', '#B22222'],
    gradient: 'bg-gradient-to-r from-purple-700 via-orange-500 to-yellow-600'
  }
];

/**
 * Get palettes by category
 */
export const getPalettesByCategory = (category) => {
  return colorPalettes.filter(palette => palette.category === category);
};

/**
 * Get popular palettes
 */
export const getPopularPalettes = () => {
  return colorPalettes.filter(palette => palette.isPopular);
};

/**
 * Get palette by ID
 */
export const getPaletteById = (id) => {
  return colorPalettes.find(palette => palette.id === id);
};

/**
 * Category display names
 */
export const CATEGORY_DISPLAY_NAMES = {
  [COLOR_PALETTE_CATEGORIES.WARM]: 'Warm Tones',
  [COLOR_PALETTE_CATEGORIES.COOL]: 'Cool Tones',
  [COLOR_PALETTE_CATEGORIES.NATURAL]: 'Natural Tones',
  [COLOR_PALETTE_CATEGORIES.MODERN]: 'Modern',
  [COLOR_PALETTE_CATEGORIES.CLASSIC]: 'Classic',
  [COLOR_PALETTE_CATEGORIES.MINIMALIST]: 'Minimalist',
  [COLOR_PALETTE_CATEGORIES.VINTAGE]: 'Vintage',
  [COLOR_PALETTE_CATEGORIES.TROPICAL]: 'Tropical',
  [COLOR_PALETTE_CATEGORIES.SCANDINAVIAN]: 'Scandinavian',
  [COLOR_PALETTE_CATEGORIES.INDUSTRIAL]: 'Industrial',
  [COLOR_PALETTE_CATEGORIES.BOHEMIAN]: 'Bohemian',
  [COLOR_PALETTE_CATEGORIES.ART_DECO]: 'Art Deco',
  [COLOR_PALETTE_CATEGORIES.MONOCHROME]: 'Monochrome',
  [COLOR_PALETTE_CATEGORIES.PASTEL]: 'Pastel',
  [COLOR_PALETTE_CATEGORIES.EARTH]: 'Earth Tones',
  [COLOR_PALETTE_CATEGORIES.LUXURY]: 'Luxury'
};
