import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { Spinner } from "../components/shared/Spinner";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: ('user' | 'admin' | 'buyer' | 'seller')[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !user) {
            toast.error('You must be logged in to access this page');
        } else if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
            toast.error(`Access denied. Role '${user.role}' is not authorized.`);
        }
    }, [user, loading, allowedRoles]);

    if (loading) {
        return <Spinner text="Verifying authentication..." />;
    }

    if (!user) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;


