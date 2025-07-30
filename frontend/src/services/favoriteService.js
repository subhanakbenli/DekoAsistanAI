import { BaseService } from './BaseService';

/**
 * FavoriteService - Manage user favorites for designs and products
 * Extends BaseService to provide favorite-specific functionality
 */
class FavoriteService extends BaseService {
  constructor() {
    super();
    this.endpoints = {
      DESIGN_FAVORITE: '/favorites/design',
      PRODUCT_FAVORITE: '/favorites/product', 
      USER_FAVORITES: '/favorites/my-favorites',
      FAVORITE_DESIGNS: '/favorites/designs',
      FAVORITE_PRODUCTS: '/favorites/products'
    };
  }

  /**
   * Add design to favorites
   * @param {string} designId - Design ID to favorite
   * @returns {Promise<Object>} Response data
   */
  async addDesignToFavorites(designId) {
    try {
      return await this.post(`${this.endpoints.DESIGN_FAVORITE}/${designId}`);
    } catch (error) {
      console.error('Error adding design to favorites:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove design from favorites
   * @param {string} designId - Design ID to unfavorite
   * @returns {Promise<Object>} Response data
   */
  async removeDesignFromFavorites(designId) {
    try {
      return await this.delete(`${this.endpoints.DESIGN_FAVORITE}/${designId}`);
    } catch (error) {
      console.error('Error removing design from favorites:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get all user's favorites (designs and products) in a single optimized call
   * This replaces separate calls to getUserFavoriteDesigns and getUserFavoriteProducts
   * @returns {Promise<Object>} User favorites data
   */
  async getUserFavorites() {
    try {
      return await this.get(this.endpoints.USER_FAVORITES);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Add product to favorites
   * @param {Object} productData - Product data to favorite
   * @returns {Promise<Object>} Response data
   */
  async addProductToFavorites(productData) {
    try {
      return await this.post(this.endpoints.PRODUCT_FAVORITE, productData);
    } catch (error) {
      console.error('Error adding product to favorites:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Remove product from favorites
   * @param {string} productId - Product ID to unfavorite
   * @returns {Promise<Object>} Response data
   */
  async removeProductFromFavorites(productId) {
    try {
      return await this.delete(`${this.endpoints.PRODUCT_FAVORITE}/${productId}`);
    } catch (error) {
      console.error('Error removing product from favorites:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check if design is in favorites
   * @param {string} designId - Design ID to check
   * @param {Array|null} favoriteDesigns - Optional cached favorites list
   * @returns {Promise<boolean>} Whether design is favorited
   */
  async isDesignFavorited(designId, favoriteDesigns = null) {
    try {
      // If favorite designs list is provided, use it for quick check
      if (favoriteDesigns) {
        return favoriteDesigns.some(fav => fav.design_id === designId);
      }
      
      // Use the new optimized endpoint to get all favorites
      const favorites = await this.getUserFavorites();
      return favorites.favorite_designs?.some(fav => fav.design_id === designId) || false;
    } catch (error) {
      console.error('Error checking if design is favorited:', error);
      return false;
    }
  }

  /**
   * Check if product is in favorites
   * @param {string} productId - Product ID to check
   * @param {Array|null} favoriteProducts - Optional cached favorites list
   * @returns {Promise<boolean>} Whether product is favorited
   */
  async isProductFavorited(productId, favoriteProducts = null) {
    try {
      // If favorite products list is provided, use it for quick check
      if (favoriteProducts) {
        return favoriteProducts.some(fav => fav.product_id === productId);
      }
      
      // Use the new optimized endpoint to get all favorites
      const favorites = await this.getUserFavorites();
      return favorites.favorite_products?.some(fav => fav.product_id === productId) || false;
    } catch (error) {
      console.error('Error checking if product is favorited:', error);
      return false;
    }
  }
}

// Create and export singleton instance
const favoriteService = new FavoriteService();
export default favoriteService;
