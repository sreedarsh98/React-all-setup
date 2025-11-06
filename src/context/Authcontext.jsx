import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

export const Authprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  // Register/Signup function
  const register = (email, password, phoneNumber, firstName, lastName) => {
    try {
      // Get existing users from localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email or phone already exists
      const emailExists = existingUsers.some(u => u.email === email);
      const phoneExists = existingUsers.some(u => u.phoneNumber === phoneNumber);
      
      if (emailExists) {
        return { success: false, error: 'Email already registered' };
      }
      
      if (phoneExists) {
        return { success: false, error: 'Phone number already registered' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
        phoneNumber,
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      };

      // Add to users array
      existingUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return { success: true, data: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed. Please try again.',
      };
    }
  };

  // Login function - supports email or phone
  const login = (emailOrPhone, password) => {
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by email or phone
      const user = users.find(
        (u) => 
          (u.email === emailOrPhone || u.phoneNumber === emailOrPhone) &&
          u.password === password
      );

      if (!user) {
        return {
          success: false,
          error: 'Invalid email/phone or password',
        };
      }

      // Create user data without password
      const userData = {
        id: user.id,
        email: user.email,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      // Store token and current user
      const token = `token_${Date.now()}_${user.id}`;
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed. Please try again.',
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};