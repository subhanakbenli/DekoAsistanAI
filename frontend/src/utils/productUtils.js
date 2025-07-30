/**
 * ProductUtils - Product management utility class
 * Handles product categorization, validation, and grouping operations
 */
class ProductUtils {
  /**
   * Category icons mapping - Updated with new categories from backend
   */
  static CATEGORY_ICONS = {
    'Mobilyalar': '🪑',
    'Aydınlatma': '💡',
    'Dekoratif Ürünler': '🎨',
    'Aksesuarlar': '✨',
    'Tekstil': '🧵',
    'Dekoratif Objeler': '🏺',
    'Bitkiler': '🪴',
    'Perdeler': '🪟'
  };

  /**
   * Group products by category
   * @param {Array} products - Array of product objects
   * @returns {Object} Grouped products by category
   */
  static groupByCategory(products) {
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
  }

  /**
   * Validate product object structure
   * @param {Object} product - Product object to validate
   * @returns {boolean} Is valid product
   */
  static isValid(product) {
    return (
      product &&
      typeof product.name === 'string' &&
      typeof product.description === 'string' &&
      typeof product.category === 'string' &&
      product.name.trim().length > 0 &&
      product.description.trim().length > 0 &&
      product.category.trim().length > 0
    );
  }

  /**
   * Filter valid products from array
   * @param {Array} products - Array of products
   * @returns {Array} Filtered valid products
   */
  static filterValid(products) {
    if (!products || !Array.isArray(products)) {
      return [];
    }
    
    return products.filter(ProductUtils.isValid);
  }

  /**
   * Get category icon
   * @param {string} category - Product category
   * @returns {string} Category icon or default
   */
  static getCategoryIcon(category) {
    return ProductUtils.CATEGORY_ICONS[category] || '📦';
  }

  /**
   * Sort products by name
   * @param {Array} products - Array of products
   * @param {boolean} ascending - Sort order (default: true)
   * @returns {Array} Sorted products
   */
  static sortByName(products, ascending = true) {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    return [...products].sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return ascending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }

  /**
   * Search products by name or description
   * @param {Array} products - Array of products
   * @param {string} query - Search query
   * @returns {Array} Filtered products
   */
  static search(products, query) {
    if (!products || !Array.isArray(products) || !query) {
      return products || [];
    }

    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default ProductUtils;

// Legacy exports for backward compatibility
export const CATEGORY_ICONS = ProductUtils.CATEGORY_ICONS;
export const groupProductsByCategory = ProductUtils.groupByCategory;
export const isValidProduct = ProductUtils.isValid;
export const filterValidProducts = ProductUtils.filterValid;
