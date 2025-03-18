import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  getAuthHeaders: () => { 'Content-Type': string; 'Authorization': string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Removed the useNavigate hook to fix the error

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful login with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check credentials (mock validation)
      if (email && password) {
        // For demo purposes, accept any non-empty credentials
        const userData: User = {
          id: "user-1",
          email: email,
          name: email.split('@')[0]
        };
        
        // Create a mock JWT token (in a real app, this would come from the server)
        const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLTEiLCJlbWFpbCI6IiR7ZW1haWx9IiwibmFtZSI6IiR7ZW1haWwuc3BsaXQoJ0AnKVswXX0iLCJpYXQiOjE2MTkwOTUyMjB9.mockSignature`;
        
        // Store user and token in state and localStorage
        setUser(userData);
        setToken(mockToken);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", mockToken);
        
        toast.success("Login successful! Welcome to DataZen Flow.");
        
        // Instead of using navigate directly, we'll let the component handle navigation
        return;
      } else {
        throw new Error("Please enter both email and password");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    try {
      // In a real app, you would make an API call here
      // For now, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple validation
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
      
      const userData: User = {
        id: `user-${Date.now()}`,
        email,
        name
      };
      
      // Create a mock JWT token (in a real app, this would come from the server)
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLSR7RGF0ZS5ub3coKX0iLCJlbWFpbCI6IiR7ZW1haWx9IiwibmFtZSI6IiR7bmFtZX0iLCJpYXQiOjE2MTkwOTUyMjB9.mockSignature`;
      
      // Store user and token in state and localStorage
      setUser(userData);
      setToken(mockToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", mockToken);
      
      toast.success("Registration successful! Welcome to DataZen Flow.");
      
      // Instead of using navigate directly, we'll let the component handle navigation
      return;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logout successful!");
    // Instead of using navigate, we'll let the component handle navigation
  };

  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        login,
        register,
        logout,
        getAuthHeaders
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
