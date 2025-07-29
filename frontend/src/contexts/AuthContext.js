import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.getUserInfo();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      // Token might be expired, clear it
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      localStorage.setItem('token', response.access_token);
      
      // Get user info after login
      const userData = await authService.getUserInfo();
      setUser(userData);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      let errorMessage = 'Giriş işlemi başarısız oldu';
      
      if (error.response?.status === 401) {
        errorMessage = 'E-posta veya şifre hatalı';
      } else if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          if (detail.includes('Incorrect email or password')) {
            errorMessage = 'E-posta veya şifre hatalı';
          } else if (detail.includes('User not found')) {
            errorMessage = 'Bu e-posta adresi ile kayıtlı kullanıcı bulunamadı';
          } else {
            errorMessage = detail;
          }
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      const response = await authService.register(email, password, firstName, lastName);
      
      // Auto-login after registration
      if (response.success) {
        const loginResult = await login(email, password);
        return loginResult;
      }
      
      return { success: true };
    } catch (error) {
      // Extract more specific error messages
      let errorMessage = 'Kayıt işlemi başarısız oldu';
      
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        
        // Handle validation errors array
        if (Array.isArray(detail)) {
          const messages = detail.map(err => {
            if (err.msg.includes('at least 8 characters')) {
              return 'Şifre en az 8 karakter olmalıdır';
            }
            if (err.msg.includes('Field required') && err.loc.includes('username')) {
              return 'Kullanıcı adı gereklidir';
            }
            if (err.msg.includes('valid email')) {
              return 'Geçerli bir e-posta adresi girin';
            }
            if (err.msg.includes('already exists') || err.msg.includes('already registered')) {
              return 'Bu e-posta adresi zaten kayıtlı';
            }
            return err.msg;
          });
          errorMessage = messages.join(', ');
        } else if (typeof detail === 'string') {
          if (detail.includes('already exists') || detail.includes('already registered')) {
            errorMessage = 'Bu e-posta adresi zaten kayıtlı';
          } else {
            errorMessage = detail;
          }
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    setUser,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
