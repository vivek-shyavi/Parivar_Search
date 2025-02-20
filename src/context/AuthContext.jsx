
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage/sessionStorage if needed
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (userType && token && savedUser) {
      // Parse the complete user object including email
      const userData = JSON.parse(savedUser);
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Make sure email is included in userData
    if (!userData.email) {
      console.error('Email is missing from user data');
      return;
    }
  
    const userWithEmail = {
      user_type: userData.user_type,
      token: userData.token,
      email: userData.email,
      user_id: userData.user_id // Store the user_id
    };
  
    setUser(userWithEmail);
    localStorage.setItem('user', JSON.stringify(userWithEmail));
    localStorage.setItem('user_type', userData.user_type);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user_id', userData.user_id); // Store the user_id in localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('user_type');
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');

    // Clear search-related items from localStorage
    localStorage.removeItem('searchParams');
    localStorage.removeItem('searchResults');
    localStorage.removeItem('currentPage');
    
    // Clear any additional stored data
    localStorage.clear();
    sessionStorage.clear();
    
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export const ProtectedRoute = ({ children, allowedUserTypes = ['USER', 'ADMIN'] }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (!allowedUserTypes.includes(user.user_type)) {
    const redirectTo = user.user_type === 'ADMIN' ? '/admin-dashboard' : '/user-dashboard';
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
