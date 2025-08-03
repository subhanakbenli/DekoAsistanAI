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
    colorPalette: null, // Renk paleti bilgisi için
    productCategories: null, // Ürün kategorileri bilgisi için
    doorWindow: null, // Kapı/pencere konumu bilgisi için
    price: '' // Fiyat limiti (TL)
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
      colorPalette: null,
      productCategories: null,
      doorWindow: null,
      price: ''
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
      price: parseFloat(form.price) || 0
    };
  }, [form]);

  /**
   * Check if form has unsaved changes
   * @returns {boolean} Whether form is dirty
   */
  const isDirty = useCallback(() => {
    return form.width || form.length || form.height || 
           form.notes?.trim();
  }, [form.width, form.length, form.height, form.notes]);

  return {
    // State
    form,
    
    // Actions
    handleFormChange,
    validateForm,
    resetForm,
    updateForm,
    getFormData,
    
    // Computed
    isDirty: isDirty()
  };
};

export default useFormState;
