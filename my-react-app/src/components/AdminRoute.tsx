import { useAuth } from "../context/AuthContext"
import { Navigate, Outlet } from "react-router-dom";

export const AdminRoute = () => {

	const { user } = useAuth();

	if (user === null) {
		return <p>Loading authorization...</p>;
	}

	return user.role === 'admin' ? <Outlet /> : <Navigate to="/profile" replace />;
 
};

export default AdminRoute;
