/**
 * ScrollUtils - DOM scroll operations utility class
 * Provides centralized scroll functionality following OOP principles
 */
class ScrollUtils {
  /**
   * Smooth scroll to element by ID
   * @param {string} elementId - Target element ID
   * @param {Object} options - Scroll options
   */
  static scrollToElement(elementId, options = { behavior: 'smooth' }) {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView(options);
    }
  }

  /**
   * Smooth scroll to top of page
   * @param {Object} options - Scroll options
   */
  static scrollToTop(options = { behavior: 'smooth' }) {
    window.scrollTo({ top: 0, ...options });
  }

  /**
   * Smooth scroll to bottom of page
   * @param {Object} options - Scroll options
   */
  static scrollToBottom(options = { behavior: 'smooth' }) {
    window.scrollTo({ 
      top: document.body.scrollHeight, 
      ...options 
    });
  }

  /**
   * Check if element is in viewport
   * @param {HTMLElement|string} element - Element or element ID
   * @returns {boolean} Is element visible in viewport
   */
  static isElementInViewport(element) {
    const el = typeof element === 'string' 
      ? document.getElementById(element) 
      : element;
    
    if (!el) return false;

    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Get scroll position
   * @returns {Object} {x, y} scroll position
   */
  static getScrollPosition() {
    return {
      x: window.pageXOffset || document.documentElement.scrollLeft,
      y: window.pageYOffset || document.documentElement.scrollTop
    };
  }
}

export default ScrollUtils;

// Legacy export for backward compatibility
export const scrollToElement = ScrollUtils.scrollToElement;
