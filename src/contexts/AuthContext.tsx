import { createContext, useContext, useState, ReactNode } from "react";
import { User, UserRole, AuthState } from "../types/user";
import { toast } from "sonner";

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  register: (
    role: UserRole,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
      phone?: string;
    }
  ) => Promise<boolean>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Mock user data for demonstration purposes
  const mockUsers: User[] = [
    {
      id: "1",
      username: "student",
      email: "student@example.com",
      role: "student",
      firstName: "Student",
      lastName: "User",
      createdAt: new Date(),
      is2FAEnabled: false,
    },
    {
      id: "2",
      username: "teacher",
      email: "teacher@example.com",
      role: "teacher",
      firstName: "Teacher",
      lastName: "User",
      createdAt: new Date(),
      is2FAEnabled: false,
    },
    {
      id: "3",
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      firstName: "Admin",
      lastName: "User",
      createdAt: new Date(),
      is2FAEnabled: false,
    },
  ];

  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // For demo: simple mock authentication
      // In a real application, this would be an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = mockUsers.find((u) => u.email === email);
          
          if (user && password.length > 0) { // Mock validation
            setAuthState({
              isAuthenticated: true,
              user,
              isLoading: false,
            });
            
            // Store auth in localStorage if rememberMe is checked
            if (rememberMe) {
              localStorage.setItem("authUser", JSON.stringify(user));
            }
            
            toast.success(`Welcome back, ${user.firstName}!`);
            
            resolve(true);
          } else {
            setAuthState({
              ...initialState,
              isLoading: false,
            });
            
            toast.error("Invalid email or password. Please try again.");
            
            resolve(false);
          }
        }, 1000);
      });
    } catch (error) {
      setAuthState({
        ...initialState,
        isLoading: false,
      });
      
      toast.error("An unexpected error occurred. Please try again.");
      
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setAuthState(initialState);
    toast.success("You have been successfully logged out.");
  };

  const register = async (
    role: UserRole,
    userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      username: string;
      phone?: string;
    }
  ): Promise<boolean> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      // For demo: simple mock registration
      // In a real application, this would be an API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const existingUser = mockUsers.find(
            (u) => u.email === userData.email || u.username === userData.username
          );
          
          if (existingUser) {
            setAuthState({
              ...initialState,
              isLoading: false,
            });
            
            toast.error("Email or username already exists. Please try different credentials.");
            
            resolve(false);
          } else {
            // Create new user
            const newUser: User = {
              id: Math.random().toString(36).substr(2, 9),
              username: userData.username,
              email: userData.email,
              phone: userData.phone,
              role: role,
              firstName: userData.firstName,
              lastName: userData.lastName,
              createdAt: new Date(),
              is2FAEnabled: false,
            };
            
            // In a real app, this would save to database
            mockUsers.push(newUser);
            
            setAuthState({
              isAuthenticated: true,
              user: newUser,
              isLoading: false,
            });
            
            toast.success(`Welcome, ${newUser.firstName}! Your account has been created.`);
            
            // Store auth in localStorage
            localStorage.setItem("authUser", JSON.stringify(newUser));
            
            resolve(true);
          }
        }, 1500);
      });
    } catch (error) {
      setAuthState({
        ...initialState,
        isLoading: false,
      });
      
      toast.error("An unexpected error occurred. Please try again.");
      
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
