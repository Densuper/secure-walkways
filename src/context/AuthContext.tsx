
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: 'user' | 'admin') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('secureWalkUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'user' | 'admin'): Promise<boolean> => {
    setLoading(true);
    
    // This is a mock authentication - in a real app, we would validate credentials against a backend
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes, any non-empty username/password combination is valid
        if (username.trim() && password.trim()) {
          const newUser = {
            id: `${role}_${Date.now()}`,
            username,
            role
          };
          setUser(newUser);
          localStorage.setItem('secureWalkUser', JSON.stringify(newUser));
          setLoading(false);
          resolve(true);
        } else {
          setLoading(false);
          resolve(false);
        }
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureWalkUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
