import { useState } from 'react';
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
    extras: []
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
  const handleFormChange = (e) => {
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
  };

  /**
   * Handle new block form changes
   * @param {Event} e - Input change event  
   */
  const handleBlockChange = (e) => {
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
  };

  /**
   * Add a new block to extras array
   */
  const addBlock = () => {
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
  };

  /**
   * Remove block from extras array
   * @param {number} indexToRemove - Index of block to remove
   */
  const removeBlock = (indexToRemove) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.filter((_, index) => index !== indexToRemove)
    }));
  };

  /**
   * Validate entire form
   * @returns {Object} Validation result {isValid: boolean, errors: string[]}
   */
  const validateForm = () => {
    return ValidationUtils.validateRoomForm(form);
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setForm({
      roomType: 'salon',
      designStyle: 'modern',
      notes: '',
      width: '',
      length: '', 
      height: '',
      extras: []
    });
    setNewBlock({ width: '', length: '', x: '', y: '' });
  };

  /**
   * Update form with new data (useful for loading saved designs)
   * @param {Object} newFormData - New form data
   */
  const updateForm = (newFormData) => {
    setForm(prev => ({
      ...prev,
      ...newFormData
    }));
  };

  /**
   * Get form data for submission
   * @returns {Object} Clean form data
   */
  const getFormData = () => {
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
  };

  /**
   * Check if form has unsaved changes
   * @returns {boolean} Whether form is dirty
   */
  const isDirty = () => {
    return form.width || form.length || form.height || 
           form.notes.trim() || form.extras.length > 0;
  };

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
