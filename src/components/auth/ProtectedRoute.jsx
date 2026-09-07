import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute({children, allowedRoles}) {

    const auth = useSelector((state) => state.auth);

    if (!auth.isAuthenticated) {
        return (<Navigate to="/login" replace/>);
    }
    if (allowedRoles && !allowedRoles.includes(auth.roleName))
    {
        return (<Navigate to="/" replace/>);
    }
    return children;
}

export default ProtectedRoute; ProtectedRoute;