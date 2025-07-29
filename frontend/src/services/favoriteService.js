/**
 * Favorite Service - API operations for favorites
 */

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Get authentication headers with token
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

/**
 * Handle API response
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const favoriteService = {
  /**
   * Add design to favorites
   */
  addDesignToFavorites: async (designId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/design/${designId}`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding design to favorites:', error);
      throw error;
    }
  },

  /**
   * Remove design from favorites
   */
  removeDesignFromFavorites: async (designId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/design/${designId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error removing design from favorites:', error);
      throw error;
    }
  },

  /**
   * Get all user's favorites (designs and products) in a single optimized call
   * This replaces separate calls to getUserFavoriteDesigns and getUserFavoriteProducts
   */
  getUserFavorites: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/my-favorites`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      throw error;
    }
  },

  /**
   * Add product to favorites
   */
  addProductToFavorites: async (productData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/product`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error adding product to favorites:', error);
      throw error;
    }
  },

  /**
   * Remove product from favorites
   */
  removeProductFromFavorites: async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/product/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error removing product from favorites:', error);
      throw error;
    }
  },

  /**
   * Check if design is in favorites
   */
  isDesignFavorited: async (designId, favoriteDesigns = null) => {
    try {
      // If favorite designs list is provided, use it for quick check
      if (favoriteDesigns) {
        return favoriteDesigns.some(fav => fav.design_id === designId);
      }
      
      // Use the new optimized endpoint to get all favorites
      const favorites = await favoriteService.getUserFavorites();
      return favorites.favorite_designs?.some(fav => fav.design_id === designId) || false;
    } catch (error) {
      console.error('Error checking if design is favorited:', error);
      return false;
    }
  }
};

export default favoriteService;
