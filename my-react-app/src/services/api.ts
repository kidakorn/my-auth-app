//สร้างระบบจัดการ API (Axios Instance)
import axios  from "axios";

const api = axios.create({
	baseURL: 'http://localhost:3000/api'
});

// **Interceptor: หัวใจสำคัญของการส่ง Token**
// นี่คือฟังก์ชันที่จะทำงาน "ก่อน" ทุก Request ถูกส่ง
api.interceptors.request.use(
	(config) => {

		// 1. ดึง Token มาจาก localStorage
		const token = localStorage.getItem('token');

		// 2. ถ้ามี Token, ให้แนบไปกับ Header
		if(token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default api;
