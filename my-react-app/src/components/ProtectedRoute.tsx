import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { token } = useAuth();

    // ถ้ามี Token (ล็อกอินแล้ว) ให้แสดงหน้าที่อยู่ข้างใน (Outlet)
    // ถ้าไม่มี Token ให้เด้งไปหน้า Login
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;