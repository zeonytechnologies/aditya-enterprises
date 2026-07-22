import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const cachedUser = api.auth.getCurrentUser();
        if (cachedUser) {
          setUser(cachedUser);
        }
        
        // If Supabase is active, fetch the live database session profile
        const freshUser = await api.auth.getSessionUser();
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('aditya_current_user', JSON.stringify(freshUser));
        } else if (cachedUser && isSupabaseConfigured) {
          // If Supabase session expired but cache existed, log them out
          setUser(null);
          localStorage.removeItem('aditya_current_user');
        }
      } catch (err) {
        console.error('Error initializing authentication:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const loggedUser = await api.auth.login(identifier, password);
      setUser(loggedUser);
      localStorage.setItem('aditya_current_user', JSON.stringify(loggedUser));
      return loggedUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, fullName, companyName, gstNumber, role, phone) => {
    setLoading(true);
    try {
      const registeredUser = await api.auth.register(
        email,
        password,
        fullName,
        companyName,
        gstNumber,
        role,
        phone
      );
      // Auto-login customer, but for dealers, we can auto-login or request approval
      // In this setup, we automatically log them in for testability
      setUser(registeredUser);
      localStorage.setItem('aditya_current_user', JSON.stringify(registeredUser));
      return registeredUser;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.auth.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const users = await api.admin.getUsersList();
      const updated = users.find(u => u.id === user.id);
      if (updated) {
        setUser(updated);
        localStorage.setItem('aditya_current_user', JSON.stringify(updated));
      }
    } catch (err) {
      console.error('Error refreshing profile:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
