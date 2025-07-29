import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import favoriteService from '../services/favoriteService';

/**
 * Custom hook for managing favorites
 */
export const useFavorites = () => {
  const { user, isAuthenticated } = useAuth();
  const [favoriteDesigns, setFavoriteDesigns] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch user's favorite designs
   */
  const fetchFavoriteDesigns = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteDesigns([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const designs = await favoriteService.getUserFavoriteDesigns();
      setFavoriteDesigns(designs || []);
    } catch (err) {
      console.error('Error fetching favorite designs:', err);
      setError(err.message);
      setFavoriteDesigns([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Fetch user's favorite products
   */
  const fetchFavoriteProducts = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteProducts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const products = await favoriteService.getUserFavoriteProducts();
      setFavoriteProducts(products || []);
    } catch (err) {
      console.error('Error fetching favorite products:', err);
      setError(err.message);
      setFavoriteProducts([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Add design to favorites
   */
  const addDesignToFavorites = useCallback(async (designId) => {
    if (!isAuthenticated) {
      throw new Error('Favorilere eklemek için giriş yapın');
    }

    try {
      setError(null);
      await favoriteService.addDesignToFavorites(designId);
      
      // Refresh favorites list
      await fetchFavoriteDesigns();
      
      return { success: true, message: 'Tasarım favorilere eklendi!' };
    } catch (err) {
      console.error('Error adding design to favorites:', err);
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, fetchFavoriteDesigns]);

  /**
   * Remove design from favorites
   */
  const removeDesignFromFavorites = useCallback(async (designId) => {
    if (!isAuthenticated) {
      throw new Error('Bu işlem için giriş yapın');
    }

    try {
      setError(null);
      await favoriteService.removeDesignFromFavorites(designId);
      
      // Refresh favorites list
      await fetchFavoriteDesigns();
      
      return { success: true, message: 'Tasarım favorilerden çıkarıldı!' };
    } catch (err) {
      console.error('Error removing design from favorites:', err);
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, fetchFavoriteDesigns]);

  /**
   * Add product to favorites
   */
  const addProductToFavorites = useCallback(async (productData) => {
    if (!isAuthenticated) {
      throw new Error('Favorilere eklemek için giriş yapın');
    }

    try {
      setError(null);
      await favoriteService.addProductToFavorites(productData);
      
      // Refresh favorites list
      await fetchFavoriteProducts();
      
      return { success: true, message: 'Ürün favorilere eklendi!' };
    } catch (err) {
      console.error('Error adding product to favorites:', err);
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, fetchFavoriteProducts]);

  /**
   * Remove product from favorites
   */
  const removeProductFromFavorites = useCallback(async (productId) => {
    if (!isAuthenticated) {
      throw new Error('Bu işlem için giriş yapın');
    }

    try {
      setError(null);
      await favoriteService.removeProductFromFavorites(productId);
      
      // Refresh favorites list
      await fetchFavoriteProducts();
      
      return { success: true, message: 'Ürün favorilerden çıkarıldı!' };
    } catch (err) {
      console.error('Error removing product from favorites:', err);
      setError(err.message);
      throw err;
    }
  }, [isAuthenticated, fetchFavoriteProducts]);

  /**
   * Check if design is in favorites
   */
  const isDesignFavorited = useCallback((designId) => {
    return favoriteDesigns.some(fav => fav.design_id === designId);
  }, [favoriteDesigns]);

  /**
   * Check if product is in favorites
   */
  const isProductFavorited = useCallback((productId) => {
    return favoriteProducts.some(fav => fav.id === productId);
  }, [favoriteProducts]);

  /**
   * Toggle design favorite status
   */
  const toggleDesignFavorite = useCallback(async (designId) => {
    const isFavorited = isDesignFavorited(designId);
    
    if (isFavorited) {
      return await removeDesignFromFavorites(designId);
    } else {
      return await addDesignToFavorites(designId);
    }
  }, [isDesignFavorited, addDesignToFavorites, removeDesignFromFavorites]);

  /**
   * Refresh all favorites
   */
  const refreshFavorites = useCallback(async () => {
    await Promise.all([
      fetchFavoriteDesigns(),
      fetchFavoriteProducts()
    ]);
  }, [fetchFavoriteDesigns, fetchFavoriteProducts]);

  // Load favorites when user authentication changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshFavorites();
    } else {
      setFavoriteDesigns([]);
      setFavoriteProducts([]);
    }
  }, [isAuthenticated, user, refreshFavorites]);

  return {
    // State
    favoriteDesigns,
    favoriteProducts,
    loading,
    error,
    
    // Design favorites
    addDesignToFavorites,
    removeDesignFromFavorites,
    toggleDesignFavorite,
    isDesignFavorited,
    
    // Product favorites
    addProductToFavorites,
    removeProductFromFavorites,
    isProductFavorited,
    
    // Utils
    refreshFavorites,
    fetchFavoriteDesigns,
    fetchFavoriteProducts
  };
};

export default useFavorites;
