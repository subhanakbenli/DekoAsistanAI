/**
 * Product utilities for grouping and categorization
 */

/**
 * Category icons mapping
 */
export const CATEGORY_ICONS = {
  'Mobilyalar': '🪑',
  'Aydınlatma': '💡',
  'Dekoratif Ürünler': '🎨',
  'Aksesuarlar': '✨'
};

/**
 * Group products by category
 * @param {Array} products - Array of product objects
 * @returns {Object} Grouped products by category
 */
export const groupProductsByCategory = (products) => {
  if (!products || !Array.isArray(products)) {
    return {};
  }

  return products.reduce((acc, product) => {
    const category = product.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});
};

/**
 * Validate product object structure for new format
 * @param {Object} product - Product object to validate
 * @returns {boolean} Is valid product
 */
export const isValidProduct = (product) => {
  return (
    product &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.category === 'string' &&
    product.name.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.category.trim().length > 0
  );
};

/**
 * Filter valid products from array
 * @param {Array} products - Array of products
 * @returns {Array} Filtered valid products
 */
export const filterValidProducts = (products) => {
  if (!products || !Array.isArray(products)) {
    return [];
  }
  
  return products.filter(isValidProduct);
};
