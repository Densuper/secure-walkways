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

// Dynamically determine the API base URL - with fallback to window.location.origin
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || window.location.origin;
console.log('API Base URL used by AuthContext:', API_BASE_URL);

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
    
    // Mock login for local development without a backend
    if (process.env.NODE_ENV === 'development' && !API_BASE_URL) {
      console.log('Using mock login in development');
      const mockUsers = [
        { username: 'admin', password: 'admin', role: 'admin' },
        { username: 'user', password: 'user', role: 'user' }
      ];
      
      const foundUser = mockUsers.find(
        user => user.username === username && user.password === password
      );
      
      if (foundUser) {
        const newUser = {
          id: `${foundUser.role}_${Date.now()}`,
          username: foundUser.username,
          role: foundUser.role as 'user' | 'admin'
        };
        
        setUser(newUser);
        localStorage.setItem('secureWalkUser', JSON.stringify(newUser));
        localStorage.setItem('secureWalkToken', 'mock-token-for-development');
        
        clearUserSessionData();
        setLoading(false);
        return true;
      } else {
        setLoading(false);
        toast({
          title: "Login failed",
          description: "Invalid credentials",
          variant: "destructive"
        });
        return false;
      }
    }
    
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
        
        // Clear any previous session data for this user
        clearUserSessionData();
        
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

  const clearUserSessionData = () => {
    // Clear all user-specific session data
    if (user) {
      // Clear expanded state data
      sessionStorage.removeItem(`userExpandedCheckpoint_${user.id}`);
      sessionStorage.removeItem(`adminExpandedWalk_${user.id}`);
      
      // If there's an ongoing walk, save its state
      const ongoingWalkId = sessionStorage.getItem(`ongoingWalk_${user.id}`);
      if (ongoingWalkId && user.role === 'user') {
        try {
          // Try to mark the walk as "Partially Completed" on the server
          fetch(`${API_BASE_URL}/api/save-walk-progress`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem('secureWalkToken')}`
            },
            body: JSON.stringify({ 
              userId: user.id, 
              walkId: ongoingWalkId,
              status: 'Partially Completed'
            }),
          }).catch(err => console.error("Error saving walk progress:", err));
        } catch (error) {
          console.error("Error saving walk progress:", error);
        }
      }
    }
  };

  const logout = async () => {
    if (user) {
      // Attempt to invalidate token on server
      const token = localStorage.getItem('secureWalkToken');
      
      if (token) {
        try {
          // Call the logout endpoint to invalidate the token
          await fetch(`${API_BASE_URL}/api/logout`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error("Logout error:", error);
          // Continue with local logout even if server request fails
        }
      }
      
      // Clear user data from state and storage
      setUser(null);
      localStorage.removeItem('secureWalkUser');
      localStorage.removeItem('secureWalkToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
