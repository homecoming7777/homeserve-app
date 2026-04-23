import { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) {
      const enriched = userService.ensureWalletBalance(current);
      setUser(enriched);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { user, token } = authService.login(email, password);
    const enriched = userService.ensureWalletBalance(user);
    setUser(enriched);
    return enriched;
  };

  const register = async (userData) => {
    const { user, token } = authService.register(userData);
    const enriched = userService.ensureWalletBalance(user);
    setUser(enriched);
    return enriched;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};