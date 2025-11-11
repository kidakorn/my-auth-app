import { useState, type FormEvent } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { token } = useParams(); 
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 2. ตรวจสอบว่ารหัสผ่านตรงกัน
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            // 3. ยิง API ไปยัง Endpoint ที่ 2 (ส่ง Token ไปใน URL)
            const res = await api.post(`/auth/reset-password/${token}`, { password });

            // 4. แสดงข้อความสำเร็จ และเตรียมส่งกลับไปหน้า Login
            setMessage(res.data.message + " Redirecting to login in 3 seconds...");

            setTimeout(() => {
                navigate('/login');
            }, 3000); // 3 วินาที

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            // 5. แสดง Error (เช่น Token หมดอายุ หรือไม่ถูกต้อง)
            setError(err.response?.data?.message || 'An error occurred.');
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md space-y-6 mt-8 sm:mt-12 p-6 sm:p-8 shadow-xl rounded-xl bg-white border border-gray-100">
                <h2 className="text-3xl font-extrabold text-center text-gray-800">
                    Set New Password
                </h2>

                {message && (
                    <div className="p-4 text-center bg-green-100 text-green-700 rounded-lg">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-4 text-center bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                {!message && (
                    <>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Enter new password" 
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                         <input 
                            type="password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            placeholder="Confirm new password" 
                            required
                            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 disabled:bg-gray-400"
                        >
                            {loading ? 'Setting...' : 'Set New Password'}
                        </button>
                    </>
                )}

                {/* (แสดงลิงก์กลับไป Login เสมอ) */}
                <p className="text-center text-sm text-gray-600">
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">
                        Back to Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPassword;