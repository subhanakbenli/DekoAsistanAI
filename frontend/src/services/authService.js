import { BaseService } from './BaseService';

/**
 * AuthService - Authentication and user management service
 * Extends BaseService to provide authentication-specific functionality
 */
class AuthService extends BaseService {
  constructor() {
    super(); // Call BaseService constructor
    this.endpoints = {
      REGISTER: '/auth/register',
      LOGIN: '/auth/login',
      USER_INFO: '/auth/me',
      PROFILE: '/auth/profile'
    };
  }

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password 
   * @param {string} firstName - User first name
   * @param {string} lastName - User last name
   * @returns {Promise<Object>} Registration response
   */
  async register(email, password, firstName, lastName) {
    try {
      const userData = {
        email,
        username: email, // Backend expects username field
        password,
        first_name: firstName,
        last_name: lastName
      };

      return await this.post(this.endpoints.REGISTER, userData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Login user with credentials
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} Login response with token
   */
  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      // Use fetch for FormData (axios has issues with FormData in some cases)
      const response = await fetch(`${this.baseURL}${this.endpoints.LOGIN}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error('Login failed');
        error.response = { data: errorData, status: response.status };
        throw error;
      }

      return await response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get current user information
   * @returns {Promise<Object>} User data
   */
  async getUserInfo() {
    try {
      return await this.get(this.endpoints.USER_INFO);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile data
   */
  async updateProfile(profileData) {
    try {
      return await this.put(this.endpoints.PROFILE, profileData);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Logout user (clear token)
   */
  logout() {
    localStorage.removeItem('token');
  }

  /**
   * Store authentication token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }
}

// Create and export singleton instance
export const authService = new AuthService();
export default authService;
