import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    // Create axios instance with base configuration
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token expiry
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear it
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async register(email, password, firstName, lastName) {
    const response = await this.api.post('/auth/register', {
      email,
      username: email, // Backend expects username field
      password,
      first_name: firstName,
      last_name: lastName
    });
    return response.data;
  }

  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
  }

  async getUserInfo() {
    const response = await this.api.get('/auth/me');
    return response.data;
  }

  async updateProfile(profileData) {
    const response = await this.api.put('/auth/profile', profileData);
    return response.data;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export const authService = new AuthService();
