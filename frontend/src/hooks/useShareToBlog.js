import { useState, useCallback, useMemo } from 'react';
import { blogService } from '../services/blogService';
import { ErrorHandler } from '../utils/ErrorHandler';

/**
 * Generate blog title from design data
 */
const generateBlogTitle = (designData) => {
  const roomTypeNames = {
    salon: 'Salon',
    yatak: 'Yatak Odası', 
    çocuk: 'Çocuk Odası',
    mutfak: 'Mutfak',
    banyo: 'Banyo',
    yemek: 'Yemek Odası',
    çalışma: 'Çalışma Odası',
    misafir: 'Misafir Odası'
  };

  const styleNames = {
    modern: 'Modern',
    minimal: 'Minimalist',
    klasik: 'Klasik'
  };

  const roomName = roomTypeNames[designData.roomType] || 'Oda';
  const styleName = styleNames[designData.designStyle] || designData.designStyle;
  
  return `${styleName} ${roomName} Tasarımı`;
};

/**
 * Generate blog content from design data
 */
const generateBlogContent = (designData) => {
  let content = `# ${generateBlogTitle(designData)}\n\n`;
  
  // Oda bilgileri
  content += `## Oda Bilgileri\n`;
  content += `- **Oda Türü:** ${designData.roomType}\n`;
  content += `- **Tasarım Tarzı:** ${designData.designStyle}\n`;
  content += `- **Boyutlar:** ${designData.width}cm x ${designData.length}cm x ${designData.height}cm\n\n`;

  // Renk paleti
  if (designData.colorPalette) {
    content += `## Renk Paleti\n`;
    if (designData.colorPalette.type === 'palette') {
      content += `Seçilen renk paleti: **${designData.colorPalette.palette?.name}**\n`;
      content += `${designData.colorPalette.palette?.description}\n\n`;
    } else {
      content += `Özel renk tercihleri: ${designData.colorPalette.description}\n\n`;
    }
  }

  // Ürün kategorileri
  if (designData.productCategories) {
    content += `## Ürün Kategorileri\n`;
    if (designData.productCategories.type === 'categories') {
      const productNames = designData.productCategories.products?.map(p => p.name).join(', ');
      content += `Seçilen ürünler: ${productNames}\n\n`;
    } else {
      content += `Özel ürün tercihleri: ${designData.productCategories.description}\n\n`;
    }
  }

  // Kapı/pencere bilgileri
  if (designData.doorWindow) {
    content += `## Mimari Özellikler\n`;
    content += `${designData.doorWindow.description}\n\n`;
  }

  // Tasarım notları
  if (designData.notes) {
    content += `## Tasarım Notları\n`;
    content += `${designData.notes}\n\n`;
  }

  content += `---\n*Bu tasarım Deko Asistan ile oluşturulmuştur.*`;

  return content;
};

/**
 * Generate blog tags from design data
 */
const generateBlogTags = (designData) => {
  const tags = [];
  
  if (designData.roomType) tags.push(designData.roomType);
  if (designData.designStyle) tags.push(designData.designStyle);
  
  tags.push('dekorasyon', 'iç mimari', 'tasarım', 'ai-tasarım');
  
  // Renk paleti etiketleri
  if (designData.colorPalette?.palette?.category) {
    tags.push(designData.colorPalette.palette.category);
  }
  
  return [...new Set(tags)]; // Duplicate'ları kaldır
};

/**
 * Custom hook for sharing designs to blog
 * Handles publishing, loading states, and error management
 */
export const useShareToBlog = () => {
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedPost, setPublishedPost] = useState(null);

  /**
   * Publish a design to blog
   * @param {string} designId - Design ID to publish
   * @param {Object} designData - Design data for blog post
   * @param {Object} publishOptions - Additional publish options
   */
  const publishToBlog = useCallback(async (designId, designData, publishOptions = {}) => {
    if (!designId) {
      setPublishError('Design ID is required for publishing');
      return false;
    }

    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccess(false);

    try {
      // Prepare blog post data
      const blogPostData = {
        title: generateBlogTitle(designData),
        content: generateBlogContent(designData),
        designId,
        tags: generateBlogTags(designData),
        category: designData.roomType || 'general',
        featuredImage: designData.imageUrl,
        metadata: {
          roomDimensions: {
            width: designData.width,
            length: designData.length,
            height: designData.height
          },
          designStyle: designData.designStyle,
          roomType: designData.roomType,
          colorPalette: designData.colorPalette,
          productCategories: designData.productCategories,
          doorWindow: designData.doorWindow
        },
        ...publishOptions
      };

      const response = await blogService.publishDesignToBlog(designId, blogPostData);

      setPublishedPost(response);
      setPublishSuccess(true);
      
      return response;

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
   * Check if a design is already published
   * @param {string} designId - Design ID to check
   */
  const checkPublishStatus = useCallback(async (designId) => {
    if (!designId) return false;

    try {
      const isPublished = await blogService.isDesignPublished(designId);
      return isPublished;
    } catch (error) {
      console.warn('Error checking publish status:', error);
      return false;
    }
  }, []);

  /**
   * Clear publish state
   */
  const clearPublishState = useCallback(() => {
    setPublishError(null);
    setPublishSuccess(false);
    setPublishedPost(null);
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
    publishedPost,
    
    // Actions
    publishToBlog,
    checkPublishStatus,
    clearPublishState,
    
    // Computed
    getPublishStatusMessage,
    canPublish: !isPublishing
  };
};
