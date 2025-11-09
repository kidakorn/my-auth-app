import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from "../services/api"; 

// 1. กำหนด Type ของข้อมูล User
interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

// 2. กำหนด Type ของ Context
interface AuthContextType {
	user: User | null;
	token: string | null;
	login: (username: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => void;
	updateProfile: (username: string, email: string) => Promise<void>;
}

// 3. สร้าง Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. สร้าง Provider (ตัวจัดการ Logic)
export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

	// 5. เมื่อ Token เปลี่ยน (ตอนเริ่มโหลดแอป), ให้ดึงข้อมูล User
	useEffect(() => {
		const fetchUser = async () => {
			if(token) {
				// เราตั้งค่า localStorage.setItem('token', token) ในฟังก์ชัน login
				// และ Interceptor ของ api.ts จะแนบ Token นี้ไปโดยอัตโนมัติ
				try {
					const res = await api.get('/users/profile');
					setUser(res.data);
				} catch (error) {
					// ถ้า Token หมดอายุ หรือไม่ถูกต้อง
					console.error('Failed to fetch user', error);
					logout(); // ล้าง Token ที่ไม่ถูกต้อง
				}
			}
		};
		fetchUser();
	}, [token]); // ทำงานใหม่ทุกครั้งที่ token เปลี่ยน

	// 6. Logic การ Login
	const login = async (username: string, password: string) => {
		const res = await api.post('/auth/login', { username, password });
		const { token } = res.data;

		localStorage.setItem('token', token); // บันทึก Token ลง localStorage
		setToken(token); // อัปเดต State (ซึ่งจะ trigger useEffect ด้านบน)
	};

	// 7. Logic การ Register (และ Login ต่อทันที)
	const register = async (username: string, email: string, password: string) => {
		await api.post('/auth/register', { username, email, password});
		// หลังสมัครเสร็จ ให้ Login เลย
		await login(username, password);
	};

	// 8. Logic การ Logout
	const logout = () => {
		localStorage.removeItem('token');
		setToken(null);
		setUser(null);
	};

	const updateProfile = async (username: string, email: string) => {
		try {
			// 2.1 ยิง API ไปยัง Endpoint ที่เราเพิ่งสร้าง
			const res = await api.patch('/users/profile', { username, email });
			// 2.2 อัปเดต User state ทันทีด้วยข้อมูลใหม่ที่ Backend ส่งกลับมา
			setUser(res.data.user);
		} catch (error) {
			console.error("Failed to update profile", error);
			// โยน Error ต่อเพื่อให้ Component ที่เรียกใช้รู้ว่ามันล้มเหลว
			throw error;
		}
	};

	return(
		<AuthContext.Provider value = {{ user, token, login, register, logout, updateProfile}}>
			{children}
		</AuthContext.Provider>
	);
};

// 9. สร้าง Hook เพื่อให้เรียกใช้ง่าย
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};