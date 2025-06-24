
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (
      allowedRoles &&
      user &&
      !allowedRoles.includes(user.role)
    ) {
      // If user doesn't have the required role, redirect to dashboard
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate, allowedRoles]);

  // Show nothing while checking auth
  if (!isAuthenticated) return null;
  
  // If role check is required and user doesn't have permission, return null
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return null;

  // If everything is okay, render the children
  return <>{children}</>;
};

export default PrivateRoute;
