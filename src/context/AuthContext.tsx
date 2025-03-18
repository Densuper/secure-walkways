
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
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

// Configure this to point to your Linux server API endpoint
// You can set this to your server's IP address and port
// For example: "http://192.168.1.100:3000" or "http://your-server-hostname:3000"
const API_BASE_URL = "http://your-server-ip:3000";

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

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        const newUser = {
          id: `${data.user.role}_${Date.now()}`,
          username: data.user.username,
          role: data.user.role as 'user' | 'admin'
        };
        
        setUser(newUser);
        localStorage.setItem('secureWalkUser', JSON.stringify(newUser));
        
        // Store the JWT token for authenticated requests
        localStorage.setItem('secureWalkToken', data.token);
        
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        toast({
          title: "Login failed",
          description: data.error || "Invalid credentials",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      toast({
        title: "Connection error",
        description: "Could not connect to the server. Please check your network connection.",
        variant: "destructive"
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('secureWalkUser');
    localStorage.removeItem('secureWalkToken');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
