import { useState, useCallback } from 'react';
import { ValidationUtils } from '../utils/ValidationUtils';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Form state management hook for room design
 * Handles form data, validation, and block management
 */
export const useFormState = () => {
  const [form, setForm] = useState({
    roomType: 'salon',
    designStyle: 'modern', 
    notes: '',
    width: '',
    length: '',
    height: '',
    extras: [],
    colorPalette: null, // Renk paleti bilgisi için
    productCategories: null, // Ürün kategorileri bilgisi için
    doorWindow: null // Kapı/pencere konumu bilgisi için
  });

  const [newBlock, setNewBlock] = useState({
    width: '', 
    length: '', 
    x: '', 
    y: ''
  });

  /**
   * Handle form field changes
   * @param {Event} e - Input change event
   */
  const handleFormChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    
    if (type === 'number') {
      // For number inputs, preserve the raw value without sanitization
      // Allow empty string, digits, and decimal point
      processedValue = value.replace(/[^0-9.]/g, '');
    } else if (name === 'notes') {
      // Don't sanitize notes field to preserve spaces
      processedValue = value.replace(/[<>]/g, ''); // Only remove dangerous characters
    } else {
      // For other text inputs, apply normal sanitization
      processedValue = ValidationUtils.sanitizeInput(value);
    }
    
    setForm(prev => ({ 
      ...prev, 
      [name]: processedValue
    }));
  }, []);

  /**
   * Handle new block form changes
   * @param {Event} e - Input change event  
   */
  const handleBlockChange = useCallback((e) => {
    const { name, value, type } = e.target;
    
    let processedValue = value;
    
    if (type === 'number') {
      // For number inputs, preserve the raw value without sanitization
      // Allow empty string, digits, and decimal point
      processedValue = value.replace(/[^0-9.]/g, '');
    } else {
      processedValue = ValidationUtils.sanitizeInput(value);
    }
    
    setNewBlock(prev => ({ 
      ...prev, 
      [name]: processedValue
    }));
  }, []);

  /**
   * Add a new block to extras array
   */
  const addBlock = useCallback(() => {
    try {
      const roomDimensions = {
        width: parseInt(form.width) || 0,
        length: parseInt(form.length) || 0
      };

      const validation = ValidationUtils.validateRoomBlock(newBlock, roomDimensions);
      
      if (!validation.isValid) {
        alert(validation.error);
        return false;
      }

      const blockToAdd = {
        width: parseInt(newBlock.width),
        length: parseInt(newBlock.length), 
        x: parseInt(newBlock.x) || 0,
        y: parseInt(newBlock.y) || 0
      };

      setForm(prev => ({
        ...prev,
        extras: [...prev.extras, blockToAdd]
      }));
      
      // Reset new block form
      setNewBlock({ width: '', length: '', x: '', y: '' });
      return true;

    } catch (error) {
      ErrorHandler.handle(error, 'Block Addition', {
        showAlert: true,
        returnUserMessage: true
      });
      return false;
    }
  }, [form.width, form.length, newBlock]);

  /**
   * Remove block from extras array
   * @param {number} indexToRemove - Index of block to remove
   */
  const removeBlock = useCallback((indexToRemove) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.filter((_, index) => index !== indexToRemove)
    }));
  }, []);

  /**
   * Validate entire form
   * @returns {Object} Validation result {isValid: boolean, errors: string[]}
   */
  const validateForm = useCallback(() => {
    return ValidationUtils.validateRoomForm(form);
  }, [form]);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setForm({
      roomType: 'salon',
      designStyle: 'modern',
      notes: '',
      width: '',
      length: '', 
      height: '',
      extras: [],
      colorPalette: null,
      productCategories: null,
      doorWindow: null
    });
    setNewBlock({ width: '', length: '', x: '', y: '' });
  }, []);

  /**
   * Update form with new data (useful for loading saved designs)
   * @param {Object} newFormData - New form data
   */
  const updateForm = useCallback((newFormData) => {
    setForm(prev => ({
      ...prev,
      ...newFormData
    }));
  }, []);

  /**
   * Get form data for submission
   * @returns {Object} Clean form data
   */
  const getFormData = useCallback(() => {
    return {
      ...form,
      width: parseInt(form.width) || 0,
      length: parseInt(form.length) || 0,
      height: parseInt(form.height) || 0,
      extras: form.extras.map(extra => ({
        ...extra,
        width: parseInt(extra.width),
        length: parseInt(extra.length),
        x: parseInt(extra.x) || 0,
        y: parseInt(extra.y) || 0
      }))
    };
  }, [form]);

  /**
   * Check if form has unsaved changes
   * @returns {boolean} Whether form is dirty
   */
  const isDirty = useCallback(() => {
    return form.width || form.length || form.height || 
           form.notes.trim() || form.extras.length > 0;
  }, [form.width, form.length, form.height, form.notes, form.extras.length]);

  return {
    // State
    form,
    newBlock,
    
    // Actions
    handleFormChange,
    handleBlockChange, 
    addBlock,
    removeBlock,
    validateForm,
    resetForm,
    updateForm,
    getFormData,
    
    // Computed
    isDirty: isDirty()
  };
};

export default useFormState;
