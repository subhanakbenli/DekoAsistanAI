import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage, RoomDesignStudio, LoginPage, RegisterPage, DesignDetailPage, ProfilePage } from './pages';
import FavoritesPage from './pages/FavoritesPage';
import BlogPage from './pages/BlogPage';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/favorites" 
                element={
                  <ProtectedRoute>
                    <FavoritesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/studio" 
                element={
                  <ProtectedRoute>
                    <RoomDesignStudio />
                  </ProtectedRoute>
                } 
              />
              {/* Design detail page */}
              <Route path="/design/:designId" element={<DesignDetailPage />} />
              {/* Profile page */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
