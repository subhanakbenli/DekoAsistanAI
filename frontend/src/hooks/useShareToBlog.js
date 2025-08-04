import { useState, useCallback, useMemo } from 'react';
import { blogService } from '../services';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Custom hook for sharing designs to blog - Optimized version
 * Now sends only design ID, backend generates content from database
 */
export const useShareToBlog = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedBlogId, setPublishedBlogId] = useState(null);
  
  /**
   * Check if design is already published
   * @param {string} designId - Design ID to check
   */
  const checkPublishStatus = useCallback(async (designId) => {
    try {
      const response = await blogService.checkPublishStatus(designId);
      return response.data;
    } catch (error) {
      console.error('Error checking publish status:', error);
      return { is_published: false, blog_post_id: null };
    }
  }, []);

  /**
   * Publish design to blog - Optimized version
   * Only sends design ID, backend fetches all data from database
   * @param {string} designId - Design ID to publish
   * @param {Object} publishOptions - Additional publish options like allowComments, isPublic
   */
  const publishToBlog = useCallback(async (designId, publishOptions = {}) => {
    if (!designId) {
      setPublishError('Design ID is required for publishing');
      return false;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      // Send only design ID and publish options to backend
      // Backend will fetch design data from database and generate content
      const response = await blogService.publishDesignToBlog(designId, publishOptions);

      if (response.success) {
        setPublishedBlogId(response.blog_post_id);
        setPublishSuccess(true);
        
        return {
          success: true,
          blogPostId: response.blog_post_id,
          message: response.message
        };
      } else {
        setPublishError(response.message || 'Publishing failed');
        return false;
      }

    } catch (error) {
      const errorMessage = ErrorHandler.extractErrorMessage(error);
      setPublishError(errorMessage);
      
      ErrorHandler.handle(error, 'Blog Publish', {
        showAlert: false, // We handle this in UI
        logToConsole: true
      });
      
      return false;
    } finally {
      setIsPublishing(false);
    }
  }, []);

  /**
   * Clear publish state
   */
  const clearPublishState = useCallback(() => {
    setPublishError(null);
    setPublishSuccess(false);
    setPublishedBlogId(null);
  }, []);

  /**
   * Get publish status message
   */
  const getPublishStatusMessage = useMemo(() => {
    if (isPublishing) {
      return 'Blog\'da paylaşılıyor...';
    }
    if (publishSuccess) {
      return 'Tasarım başarıyla blog\'da paylaşıldı!';
    }
    if (publishError) {
      return `Paylaşım hatası: ${publishError}`;
    }
    return '';
  }, [isPublishing, publishSuccess, publishError]);

  return {
    // State
    isPublishing,
    publishError,
    publishSuccess,
    publishedBlogId,
    
    // Actions
    publishToBlog,
    checkPublishStatus,
    clearPublishState,
    
    // Computed
    getPublishStatusMessage,
    canPublish: !isPublishing
  };
};

export default useShareToBlog;
