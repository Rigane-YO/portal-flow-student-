
export type UserRole = "student" | "teacher" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  createdAt: Date;
  profilePicture?: string;
  is2FAEnabled: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}
