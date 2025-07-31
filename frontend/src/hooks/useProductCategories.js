import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getSuggestedProducts, 
  getPopularCombinations,
  getRoomInfo 
} from '../data/roomCategories';

/**
 * Custom hook for managing product category selection
 * Handles room type based product suggestions and localStorage persistence
 */
export const useProductCategories = (roomType = 'salon') => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [useCustomProducts, setUseCustomProducts] = useState(false);
  const [customProductDescription, setCustomProductDescription] = useState('');

  // Get room information
  const roomInfo = useMemo(() => getRoomInfo(roomType), [roomType]);
  
  // Get suggested products for current room type
  const suggestedProducts = useMemo(() => getSuggestedProducts(roomType), [roomType]);
  
  // Get popular combinations for current room type
  const popularCombinations = useMemo(() => getPopularCombinations(roomType), [roomType]);

  // Load saved state from localStorage on mount or room type change
  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(`selectedProducts_${roomType}`);
      const savedUseCustom = localStorage.getItem(`useCustomProducts_${roomType}`);
      const savedCustomDescription = localStorage.getItem(`customProductDescription_${roomType}`);

      if (savedProducts && savedProducts !== 'null') {
        const products = JSON.parse(savedProducts);
        setSelectedProducts(Array.isArray(products) ? products : []);
      } else {
        setSelectedProducts([]);
      }

      if (savedUseCustom === 'true') {
        setUseCustomProducts(true);
        if (savedCustomDescription) {
          setCustomProductDescription(savedCustomDescription);
        }
      } else {
        setUseCustomProducts(false);
        setCustomProductDescription('');
      }
    } catch (error) {
      console.warn('Error loading product categories from localStorage:', error);
      setSelectedProducts([]);
      setUseCustomProducts(false);
      setCustomProductDescription('');
    }
  }, [roomType]);

  // Save selected products to localStorage
  const handleProductToggle = useCallback((productId) => {
    setSelectedProducts(prev => {
      const newProducts = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      try {
        localStorage.setItem(`selectedProducts_${roomType}`, JSON.stringify(newProducts));
      } catch (error) {
        console.warn('Error saving product categories to localStorage:', error);
      }
      
      return newProducts;
    });
  }, [roomType]);

  // Handle custom products toggle
  const handleCustomToggle = useCallback((useCustom) => {
    setUseCustomProducts(useCustom);
    
    if (useCustom) {
      setSelectedProducts([]);
      try {
        localStorage.setItem(`selectedProducts_${roomType}`, JSON.stringify([]));
      } catch (error) {
        console.warn('Error clearing products from localStorage:', error);
      }
    } else {
      setCustomProductDescription('');
      try {
        localStorage.setItem(`customProductDescription_${roomType}`, '');
      } catch (error) {
        console.warn('Error clearing custom description from localStorage:', error);
      }
    }
    
    try {
      localStorage.setItem(`useCustomProducts_${roomType}`, useCustom.toString());
    } catch (error) {
      console.warn('Error saving custom toggle to localStorage:', error);
    }
  }, [roomType]);

  // Handle custom description change
  const handleCustomDescriptionChange = useCallback((description) => {
    setCustomProductDescription(description);
    
    try {
      localStorage.setItem(`customProductDescription_${roomType}`, description);
    } catch (error) {
      console.warn('Error saving custom description to localStorage:', error);
    }
  }, [roomType]);

  // Apply popular combination
  const applyPopularCombination = useCallback((combination) => {
    const productIds = combination.products || [];
    setSelectedProducts(productIds);
    setUseCustomProducts(false);
    
    try {
      localStorage.setItem(`selectedProducts_${roomType}`, JSON.stringify(productIds));
      localStorage.setItem(`useCustomProducts_${roomType}`, 'false');
      localStorage.setItem(`customProductDescription_${roomType}`, '');
    } catch (error) {
      console.warn('Error saving combination to localStorage:', error);
    }
  }, [roomType]);

  // Select all suggested products
  const selectAllSuggested = useCallback(() => {
    const allProductIds = suggestedProducts.map(product => product.id);
    setSelectedProducts(allProductIds);
    setUseCustomProducts(false);
    
    try {
      localStorage.setItem(`selectedProducts_${roomType}`, JSON.stringify(allProductIds));
      localStorage.setItem(`useCustomProducts_${roomType}`, 'false');
    } catch (error) {
      console.warn('Error saving all products to localStorage:', error);
    }
  }, [suggestedProducts, roomType]);

  // Clear all selections
  const clearSelection = useCallback(() => {
    setSelectedProducts([]);
    setCustomProductDescription('');
    setUseCustomProducts(false);
    
    try {
      localStorage.removeItem(`selectedProducts_${roomType}`);
      localStorage.removeItem(`useCustomProducts_${roomType}`);
      localStorage.removeItem(`customProductDescription_${roomType}`);
    } catch (error) {
      console.warn('Error clearing product categories from localStorage:', error);
    }
  }, [roomType]);

  // Validation
  const isValid = useMemo(() => {
    if (useCustomProducts) {
      // Minimum karakter sınırı kaldırıldı - boş bile olabilir
      return true;
    }
    return selectedProducts.length > 0;
  }, [useCustomProducts, selectedProducts]);

  // Get current product selection for form submission
  const getProductSelection = useCallback(() => {
    if (useCustomProducts) {
      return {
        type: 'custom',
        description: customProductDescription.trim(),
        roomType
      };
    }
    
    if (selectedProducts.length > 0) {
      const selectedProductObjects = suggestedProducts.filter(product => 
        selectedProducts.includes(product.id)
      );
      
      return {
        type: 'categories',
        products: selectedProductObjects,
        productIds: selectedProducts,
        roomType,
        description: `${roomInfo?.name || 'Oda'} için seçilen ürünler: ${selectedProductObjects.map(p => p.name).join(', ')}`
      };
    }
    
    return null;
  }, [useCustomProducts, customProductDescription, selectedProducts, suggestedProducts, roomInfo, roomType]);

  // Get validation message
  const getValidationMessage = useCallback(() => {
    if (!useCustomProducts && selectedProducts.length === 0) {
      return 'Lütfen en az bir ürün kategorisi seçin veya özel açıklama girin.';
    }
    return '';
  }, [useCustomProducts, selectedProducts]);

  // Get selection summary
  const getSelectionSummary = useCallback(() => {
    if (useCustomProducts) {
      return `Özel ürün açıklaması (${customProductDescription.length} karakter)`;
    }
    
    if (selectedProducts.length > 0) {
      return `${selectedProducts.length} ürün kategorisi seçildi`;
    }
    
    return 'Henüz seçim yapılmadı';
  }, [useCustomProducts, customProductDescription, selectedProducts]);

  return {
    // State
    selectedProducts,
    useCustomProducts,
    customProductDescription,
    roomInfo,
    suggestedProducts,
    popularCombinations,
    
    // Actions
    handleProductToggle,
    handleCustomToggle,
    handleCustomDescriptionChange,
    applyPopularCombination,
    selectAllSuggested,
    clearSelection,
    
    // Computed
    isValid,
    getProductSelection,
    getValidationMessage,
    getSelectionSummary
  };
};
