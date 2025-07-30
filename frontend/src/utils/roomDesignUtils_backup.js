import { ValidationUtils } from './ValidationUtils';

/**
 * Oda tasarımı validasyon utility'leri
 * @deprecated - Use ValidationUtils instead for new code
 */

/**
 * Form validasyonu - Delegates to ValidationUtils
 * @param {Object} form - Form verisi
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
export const validateForm = (form) => {
  return ValidationUtils.validateRoomForm(form);
};

/**
 * Çıkıntı validasyonu - Delegates to ValidationUtils
 * @param {Object} block - Çıkıntı verisi
 * @param {Object} roomDimensions - Oda boyutları {width, length}
 * @returns {Object} {isValid: boolean, error: string}
 */
export const validateBlock = (block, roomDimensions) => {
  return ValidationUtils.validateRoomBlock(block, roomDimensions);
/**
 * Tasarım önerisi oluşturucu
 * @param {Object} form - Form verisi
 * @returns {Object} Tasarım önerisi
 */
export const generateDesignSuggestion = (form) => {
  return {
    suggestion: `${form.designStyle} tarzında ${form.roomType} için öneriler hazır!`,
    extras: form.extras,
    dimensions: `${form.width} × ${form.length} × ${form.height} cm`
  };
};
