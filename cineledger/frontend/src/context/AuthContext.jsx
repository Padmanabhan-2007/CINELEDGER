import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cineledger_token');
    const savedUser = localStorage.getItem('cineledger_user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('cineledger_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const data = await authService.login({ username, password });
      localStorage.setItem('cineledger_token', data.token || 'demo-jwt-token');
      const userData = {
        id: data.id || 1,
        username: data.username || username,
        email: data.email || username,
        fullName: data.fullName || (username.includes('analyst') ? 'Priya Sharma' : 'Alexander Vance'),
        role: data.role || (username.includes('analyst') ? 'ANALYST' : 'ADMIN'),
        organizationId: data.organizationId || 1,
      };
      localStorage.setItem('cineledger_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Check if user is trying a known demo username
      const knownDemo = {
        'analyst@cineledger.io': { id: 2, username: 'analyst@cineledger.io', fullName: 'Priya Sharma', role: 'ANALYST', email: 'analyst@cineledger.io', organizationId: 3 },
        'admin@cineledger.io': { id: 1, username: 'admin@cineledger.io', fullName: 'Alexander Vance', role: 'ADMIN', email: 'admin@cineledger.io', organizationId: 1 },
        'auditor@cineledger.io': { id: 3, username: 'auditor@cineledger.io', fullName: 'Marcus Sterling', role: 'AUDITOR', email: 'auditor@cineledger.io', organizationId: 5 },
        'distributor@cineledger.io': { id: 4, username: 'distributor@cineledger.io', fullName: 'David Chen', role: 'DISTRIBUTOR', email: 'distributor@cineledger.io', organizationId: 1 },
        'exhibitor@cineledger.io': { id: 5, username: 'exhibitor@cineledger.io', fullName: 'Kavita Rao', role: 'EXHIBITOR', email: 'exhibitor@cineledger.io', organizationId: 3 },
        // Cinemaholic Audience Personas
        'audience@cinemaholic.com': { id: 10, username: 'audience@cinemaholic.com', fullName: 'Aarav Sharma', role: 'ROLE_AUDIENCE', email: 'audience@cinemaholic.com', membershipTier: 'VIP Premiere Club' },
        'rohan.verma@cinemaholic.com': { id: 11, username: 'rohan.verma@cinemaholic.com', fullName: 'Rohan Verma', role: 'ROLE_AUDIENCE', email: 'rohan.verma@cinemaholic.com', membershipTier: 'Gold Class Recliner Club' },
        'priya.k@cinemaholic.com': { id: 12, username: 'priya.k@cinemaholic.com', fullName: 'Priya K.', role: 'ROLE_AUDIENCE', email: 'priya.k@cinemaholic.com', membershipTier: 'Director’s Cut Royale' },
        'ananya.d@cinemaholic.com': { id: 13, username: 'ananya.d@cinemaholic.com', fullName: 'Ananya D.', role: 'ROLE_AUDIENCE', email: 'ananya.d@cinemaholic.com', membershipTier: 'IMAX Laser Enthusiast' },
      };

      if (knownDemo[username]) {
        const demoUser = knownDemo[username];
        localStorage.setItem('cineledger_token', 'demo-offline-token');
        localStorage.setItem('cineledger_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return demoUser;
      }
      throw err;
    }
  };

  const signup = async (formData) => {
    try {
      const data = await authService.register(formData);
      localStorage.setItem('cineledger_token', data.token || 'demo-jwt-token');
      const userData = {
        id: data.id || Date.now(),
        username: data.username || formData.username,
        email: data.email || formData.email,
        fullName: data.fullName || formData.fullName,
        role: data.role || formData.role || 'ANALYST',
        organizationId: data.organizationId || formData.organizationId || 1,
      };
      localStorage.setItem('cineledger_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (err) {
      // Fallback offline signup
      const userData = {
        id: Date.now(),
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role || 'ANALYST',
        organizationId: formData.organizationId || 1,
      };
      localStorage.setItem('cineledger_token', 'demo-offline-token');
      localStorage.setItem('cineledger_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
  };

  const logout = () => {
    localStorage.removeItem('cineledger_token');
    localStorage.removeItem('cineledger_user');
    setUser(null);
  };

  // Demo user quick switcher
  const switchDemoUser = async (role) => {
    const demoAccounts = {
      ADMIN: { id: 1, username: 'admin@cineledger.io', fullName: 'Alexander Vance', role: 'ADMIN', email: 'admin@cineledger.io', organizationId: 1 },
      ANALYST: { id: 2, username: 'analyst@cineledger.io', fullName: 'Priya Sharma', role: 'ANALYST', email: 'analyst@cineledger.io', organizationId: 3 },
      AUDITOR: { id: 3, username: 'auditor@cineledger.io', fullName: 'Marcus Sterling', role: 'AUDITOR', email: 'auditor@cineledger.io', organizationId: 5 },
      DISTRIBUTOR: { id: 4, username: 'distributor@cineledger.io', fullName: 'David Chen', role: 'DISTRIBUTOR', email: 'distributor@cineledger.io', organizationId: 1 },
      EXHIBITOR: { id: 5, username: 'exhibitor@cineledger.io', fullName: 'Kavita Rao', role: 'EXHIBITOR', email: 'exhibitor@cineledger.io', organizationId: 3 },
    };

    const target = demoAccounts[role] || demoAccounts.ANALYST;
    try {
      return await login(target.username, 'Password@123');
    } catch {
      localStorage.setItem('cineledger_token', 'demo-offline-token');
      localStorage.setItem('cineledger_user', JSON.stringify(target));
      setUser(target);
      return target;
    }
  };

  // Cinemaholic Moviegoer quick persona switcher
  const switchDemoAudience = async (personaKey = 'AARAV') => {
    const audienceAccounts = {
      AARAV: { id: 10, username: 'audience@cinemaholic.com', fullName: 'Aarav Sharma', role: 'ROLE_AUDIENCE', email: 'audience@cinemaholic.com', membershipTier: 'VIP Premiere Club' },
      ROHAN: { id: 11, username: 'rohan.verma@cinemaholic.com', fullName: 'Rohan Verma', role: 'ROLE_AUDIENCE', email: 'rohan.verma@cinemaholic.com', membershipTier: 'Gold Class Recliner Club' },
      PRIYA: { id: 12, username: 'priya.k@cinemaholic.com', fullName: 'Priya K.', role: 'ROLE_AUDIENCE', email: 'priya.k@cinemaholic.com', membershipTier: 'Director’s Cut Royale' },
      ANANYA: { id: 13, username: 'ananya.d@cinemaholic.com', fullName: 'Ananya D.', role: 'ROLE_AUDIENCE', email: 'ananya.d@cinemaholic.com', membershipTier: 'IMAX Laser Enthusiast' },
    };
    const target = audienceAccounts[personaKey] || audienceAccounts.AARAV;
    localStorage.setItem('cineledger_token', 'demo-audience-token');
    localStorage.setItem('cineledger_user', JSON.stringify(target));
    setUser(target);
    return target;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, switchDemoUser, switchDemoAudience, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
