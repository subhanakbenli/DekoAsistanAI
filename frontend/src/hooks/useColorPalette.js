import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  colorPalettes, 
  getPalettesByCategory, 
  getPopularPalettes, 
  getPaletteById,
  CATEGORY_DISPLAY_NAMES 
} from '../data/colorPalettes';

/**
 * Custom hook for managing color palette selection and state
 * Handles localStorage persistence, validation, and category filtering
 */
export const useColorPalette = () => {
  const [selectedPalette, setSelectedPalette] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [useCustomDescription, setUseCustomDescription] = useState(false);
  const [customColorDescription, setCustomColorDescription] = useState('');

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedPalette = localStorage.getItem('selectedColorPalette');
      const savedUseCustom = localStorage.getItem('useCustomColorDescription');
      const savedCustomDescription = localStorage.getItem('customColorDescription');

      if (savedPalette && savedPalette !== 'null') {
        const palette = getPaletteById(savedPalette);
        if (palette) {
          setSelectedPalette(palette);
        }
      }

      if (savedUseCustom === 'true') {
        setUseCustomDescription(true);
        if (savedCustomDescription) {
          setCustomColorDescription(savedCustomDescription);
        }
      }
    } catch (error) {
      console.warn('Error loading color palette from localStorage:', error);
    }
  }, []);

  // Save selected palette to localStorage
  const handlePaletteSelect = useCallback((palette) => {
    setSelectedPalette(palette);
    setUseCustomDescription(false);
    setCustomColorDescription('');
    
    try {
      localStorage.setItem('selectedColorPalette', palette?.id || '');
      localStorage.setItem('useCustomColorDescription', 'false');
      localStorage.setItem('customColorDescription', '');
    } catch (error) {
      console.warn('Error saving color palette to localStorage:', error);
    }
  }, []);

  // Handle custom description toggle
  const handleCustomToggle = useCallback((useCustom) => {
    setUseCustomDescription(useCustom);
    
    if (useCustom) {
      setSelectedPalette(null);
      try {
        localStorage.setItem('selectedColorPalette', '');
      } catch (error) {
        console.warn('Error clearing palette from localStorage:', error);
      }
    } else {
      setCustomColorDescription('');
      try {
        localStorage.setItem('customColorDescription', '');
      } catch (error) {
        console.warn('Error clearing custom description from localStorage:', error);
      }
    }
    
    try {
      localStorage.setItem('useCustomColorDescription', useCustom.toString());
    } catch (error) {
      console.warn('Error saving custom toggle to localStorage:', error);
    }
  }, []);

  // Handle custom description change
  const handleCustomDescriptionChange = useCallback((description) => {
    setCustomColorDescription(description);
    
    try {
      localStorage.setItem('customColorDescription', description);
    } catch (error) {
      console.warn('Error saving custom description to localStorage:', error);
    }
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
      return customColorDescription.trim().length >= 10;
    }
    return selectedPalette !== null;
  }, [useCustomDescription, customColorDescription, selectedPalette]);

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

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedPalette(null);
    setCustomColorDescription('');
    setUseCustomDescription(false);
    
    try {
      localStorage.removeItem('selectedColorPalette');
      localStorage.removeItem('useCustomColorDescription');
      localStorage.removeItem('customColorDescription');
    } catch (error) {
      console.warn('Error clearing color palette from localStorage:', error);
    }
  }, []);

  // Get validation message
  const getValidationMessage = useCallback(() => {
    if (useCustomDescription && customColorDescription.trim().length < 10) {
      return 'Renk açıklaması en az 10 karakter olmalıdır.';
    }
    if (!useCustomDescription && !selectedPalette) {
      return 'Lütfen bir renk paleti seçin veya özel açıklama girin.';
    }
    return '';
  }, [useCustomDescription, customColorDescription, selectedPalette]);

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
