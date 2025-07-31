import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  colorPalettes, 
  getPalettesByCategory, 
  getPopularPalettes, 
  getPaletteById,
  CATEGORY_DISPLAY_NAMES 
} from '../data/colorPalettes';
import { HookStorageUtils } from '../utils/LocalStorageUtils';

/**
 * Custom hook for managing color palette selection and state
 * Handles localStorage persistence, validation, and category filtering
 * Follows KISS principle with simplified, focused responsibilities
 */
export const useColorPalette = () => {
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [useCustomDescription, setUseCustomDescription] = useState(false);
  const [customColorDescription, setCustomColorDescription] = useState('');

  // Load saved state from localStorage on mount - SIMPLIFIED ✨
  useEffect(() => {
    const savedPaletteId = HookStorageUtils.colorPalette.getPalette();
    const savedUseCustom = HookStorageUtils.colorPalette.getUseCustom();
    const savedCustomDescription = HookStorageUtils.colorPalette.getCustomDescription();

    if (savedPaletteId) {
      const palette = getPaletteById(savedPaletteId);
      if (palette) {
        setSelectedPalette(palette);
      }
    }

    if (savedUseCustom) {
      setUseCustomDescription(true);
      if (savedCustomDescription) {
        setCustomColorDescription(savedCustomDescription);
      }
    }
  }, []);

  // Save selected palette to localStorage - SIMPLIFIED ✨
  const handlePaletteSelect = useCallback((palette) => {
    setSelectedPalette(palette);
    setUseCustomDescription(false);
    setCustomColorDescription('');
    
    HookStorageUtils.colorPalette.setPalette(palette?.id);
    HookStorageUtils.colorPalette.setUseCustom(false);
    HookStorageUtils.colorPalette.setCustomDescription('');
  }, []);

  // Handle custom description toggle - SIMPLIFIED ✨
  const handleCustomToggle = useCallback((useCustom) => {
    setUseCustomDescription(useCustom);
    
    if (useCustom) {
      setSelectedPalette(null);
      HookStorageUtils.colorPalette.setPalette('');
    } else {
      setCustomColorDescription('');
      HookStorageUtils.colorPalette.setCustomDescription('');
    }
    
    HookStorageUtils.colorPalette.setUseCustom(useCustom);
  }, []);

  // Handle custom description change - SIMPLIFIED ✨
  const handleCustomDescriptionChange = useCallback((description) => {
    setCustomColorDescription(description);
    HookStorageUtils.colorPalette.setCustomDescription(description);
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  // Get palettes for current category
  const currentPalettes = useMemo(() => {
    if (selectedCategory === 'popular') {
      return getPopularPalettes();
    }
    if (selectedCategory === 'all') {
      return colorPalettes;
    }
    return getPalettesByCategory(selectedCategory);
  }, [selectedCategory]);

  // Get available categories
  const availableCategories = useMemo(() => {
    const categories = [
      { id: 'popular', name: 'Popüler Paletler' },
      { id: 'all', name: 'Tüm Paletler' }
    ];
    
    // Add category-specific options
    Object.entries(CATEGORY_DISPLAY_NAMES).forEach(([key, name]) => {
      const categoryPalettes = getPalettesByCategory(key);
      if (categoryPalettes.length > 0) {
        categories.push({ id: key, name });
      }
    });
    
    return categories;
  }, []);

  // Validation
  const isValid = useMemo(() => {
    if (useCustomDescription) {
      // Minimum karakter sınırı kaldırıldı - boş bile olabilir
      return true;
    }
    return selectedPalette !== null;
  }, [useCustomDescription, selectedPalette]);

  // Get current color selection for form submission
  const getColorSelection = useCallback(() => {
    if (useCustomDescription) {
      return {
        type: 'custom',
        description: customColorDescription.trim()
      };
    }
    
    if (selectedPalette) {
      return {
        type: 'palette',
        palette: selectedPalette,
        description: `${selectedPalette.name}: ${selectedPalette.description}`,
        colors: selectedPalette.colors
      };
    }
    
    return null;
  }, [useCustomDescription, customColorDescription, selectedPalette]);

  // Clear all selections - SIMPLIFIED ✨
  const clearSelection = useCallback(() => {
    setSelectedPalette(null);
    setCustomColorDescription('');
    setUseCustomDescription(false);
    
    HookStorageUtils.colorPalette.clear();
  }, []);

  // Get validation message
  const getValidationMessage = useCallback(() => {
    if (!useCustomDescription && !selectedPalette) {
      return 'Lütfen bir renk paleti seçin veya özel açıklama girin.';
    }
    return '';
  }, [useCustomDescription, selectedPalette]);

  return {
    // State
    selectedPalette,
    selectedCategory,
    useCustomDescription,
    customColorDescription,
    currentPalettes,
    availableCategories,
    
    // Actions
    handlePaletteSelect,
    handleCustomToggle,
    handleCustomDescriptionChange,
    handleCategoryChange,
    clearSelection,
    
    // Computed
    isValid,
    getColorSelection,
    getValidationMessage
  };
};
